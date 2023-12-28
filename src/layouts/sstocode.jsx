import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { ResultModal } from "../components/ResultModal";
import { handleTarget } from "../lib/handleTarget";
import { extractCodeValueUsingRegex } from "../lib/extractCode";

export const SStoCode = () => {
  const [image, setImage] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [target, setTarget] = React.useState();
  const [result, setResult] = React.useState();
  const [uploadResult, setUploadResult] = React.useState();

  async function onGenerate(e) {
    e.preventDefault();
    setIsLoading(true);
    //const TG = handleTarget(target);
    const body = JSON.stringify({
      image: uploadResult.imageUrl,
      prompt: target,
    });

    try {
      const resp = await fetch("https://drawcode.fun/ask", {
        method: "POST",
        body: body,
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      });

      const result = await resp.json();
      const resultData = result.data;
      const content = extractCodeValueUsingRegex(resultData, target);

      setIsLoading(false);
      setResult(content);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (image) {
      const base64Prefix = "data:image/[^;]+;base64,";
      const regex = new RegExp(base64Prefix);
      const cleanImage = image.replace(regex, "");

      uploadImage(cleanImage);
    }
  }, [image]);

  async function uploadImage(image) {
    setIsLoading(true);
    const body = {
      image: image,
    };
    try {
      const res = await fetch("https://drawcode.fun/uploadImage", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      });

      const resJson = await res.json();

      if (resJson) {
        setUploadResult(resJson.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const TARGET = [
    {
      name: "HTMLCSS",
      title: "HTML + CSS",
    },
    {
      name: "HTMLTAILWIND",
      title: "HTML + Tailwind CSS",
    },
    {
      name: "RNJS",
      title: "React Native Javascript",
    },
    {
      name: "RNTS",
      title: "React Native Typescript",
    },
    {
      name: "FLUTTER",
      title: "Flutter",
    },
  ];

  return (
    <div className=" grid place-items-center min-h-screen w-full content-center bg-gray-900">
      <Link to={"/"}>
        <div className=" font-bold text-3xl text-white font-bunge p-4">
          Drawcode
        </div>
      </Link>
      <Card className="w-96">
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files.item(0);
            if (selectedFile) {
              if (
                ["image/jpeg", "image/png", "image/svg+xml"].includes(
                  selectedFile.type
                )
              ) {
                let fileReader = new FileReader();
                fileReader.readAsDataURL(selectedFile);
                fileReader.addEventListener("load", (event) => {
                  setImage(event.target.result);
                });
              }
            }
          }}
          // Add any additional "file input" related properties here.
        />
        <label htmlFor="fileInput">
          <CardHeader
            shadow={false}
            floated={false}
            className="h-72 mb-2 cursor-pointer"
          >
            <div className="grid place-items-center w-full h-full border-dashed border-2 p-2">
              {image ? (
                <img alt="ss" src={image} />
              ) : (
                <div className=" text-center">
                  <Typography variant="small">Upload / Select Image</Typography>
                  <Typography variant="small">
                    Place your screenshoot or design image here.
                  </Typography>
                </div>
              )}
            </div>
          </CardHeader>
        </label>
        {image && (
          <CardBody>
            <Select
              disabled={isLoading}
              label="Select Target"
              selected={(el) => {
                if (el) {
                  const val = el.props.value;
                  setTarget(val);
                  return el.props.name;
                }
              }}
            >
              {TARGET.map((item, index) => {
                return (
                  <Option key={index} value={item.name} name={item.title}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          </CardBody>
        )}
        <CardFooter>
          <Button
            disabled={!image || isLoading || !target}
            ripple={false}
            fullWidth={true}
            color="blue"
            className="shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            onClick={(e) => onGenerate(e)}
          >
            {isLoading ? (
              <div className="flex justify-center items-center ">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            ) : (
              "Generate Code"
            )}
          </Button>
        </CardFooter>
      </Card>
      <Typography className=" mt-4" variant="small" color="white">
        Developed by @Ibnuard
      </Typography>
      {result &&
        ReactDOM.createPortal(
          <div
            className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center"
            style={{ zIndex: 2000, backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <ResultModal target={target} setResult={setResult} html={result} />
          </div>,
          document.body
        )}
    </div>
  );
};

export default SStoCode;
