import * as React from "react";
import ReactDOM from "react-dom";
import { Tldraw, useEditor } from "@tldraw/tldraw";
import {
  Button,
  Radio,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import "@tldraw/tldraw/tldraw.css";
import { svgToPng } from "../lib/svgToPng";
import { blobToBase64 } from "../lib/blobToBase64";
import { ResultModal } from "../components/ResultModal";
import { Link } from "react-router-dom";
import { generateCode } from "../api/generateCode";
import { extractCodeValueUsingRegex } from "../lib/extractCode";

export const Canvas = () => {
  const [target, setTarget] = React.useState();
  const [options, setOptions] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState();
  const [result, setResult] = React.useState();
  const [onLoading, setOnLoading] = React.useState();

  // set on radio selected
  const onRadioselected = (tg) => {
    setTarget(tg);
    setOptions(TARGET_OPTIONS[tg]);
  };

  // set on option selected
  const onOptionSelected = (opt) => {
    setSelectedOption(opt);
  };

  // TARGET TYPE
  const EXPORT_TYPE = [
    {
      name: "HTML",
      title: "Export to HTML",
    },
    {
      name: "RN",
      title: "Export to React Native",
    },
    {
      name: "FLUTTER",
      title: "Export to Flutter",
    },
  ];

  // TARGET OPTIONS
  const TARGET_OPTIONS = {
    HTML: [
      {
        opt: "TAILWIND",
        title: "Tailwind CSS",
        default: true,
      },
      {
        opt: "CSS",
        title: "HTML + CSS",
      },
    ],
    RN: [
      {
        opt: "JS",
        title: "Javascript",
        default: true,
      },
      {
        opt: "TS",
        title: "Typescript",
      },
    ],
    FLUTTER: [],
  };

  React.useEffect(() => {
    if (target == "HTML") {
      setSelectedOption("TAILWIND");
    }

    if (target == "RN") {
      setSelectedOption("JS");
    }
  }, [target]);

  return (
    <div className="md:flex w-full h-screen">
      <div className=" md:hidden grid h-full w-full place-content-center p-8 bg-gray-900 text-center text-lg font-semibold text-white">
        You can only draw on medium screen size, try to resize your window!
      </div>
      <div className="hidden md:w-96 md:block p-4 bg-gray-900">
        <Link to={"/"}>
          <div className=" font-bold text-3xl text-white font-bunge">
            Drawcode
          </div>
        </Link>

        <div className="grid gap-y-4 my-8">
          <div>
            <div className=" font-semibold text-sm text-white font-poppins">
              Target
            </div>
            <Card className="my-2 bg-gray-800">
              <List>
                {EXPORT_TYPE.map((item, index) => {
                  return (
                    <ListItem key={item + index} className="p-0">
                      <label
                        htmlFor={item.name}
                        className="flex w-full cursor-pointer items-center px-3 py-2"
                      >
                        <ListItemPrefix className="mr-3">
                          <Radio
                            name="target-list"
                            id={item.name}
                            ripple={false}
                            className="hover:before:opacity-0"
                            color="blue"
                            disabled={onLoading}
                            containerProps={{
                              className: "p-0",
                            }}
                            onClick={() => onRadioselected(item.name)}
                          />
                        </ListItemPrefix>
                        <Typography
                          color="blue-gray"
                          className=" font-normal text-sm text-white"
                        >
                          {item.title}
                        </Typography>
                      </label>
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          </div>
          {options.length > 0 && (
            <div>
              <div className=" font-semibold text-sm text-white font-poppins">
                Options
              </div>
              <Card className="my-2 bg-gray-800">
                <List>
                  {options.map((item, index) => {
                    return (
                      <ListItem key={item + index} className="p-0">
                        <label
                          htmlFor={item.opt}
                          className="flex w-full cursor-pointer items-center px-3 py-2"
                        >
                          <ListItemPrefix className="mr-3">
                            <Radio
                              defaultChecked={item.default}
                              name="option-list"
                              id={item.opt}
                              ripple={false}
                              className="hover:before:opacity-0"
                              color="blue"
                              disabled={onLoading}
                              containerProps={{
                                className: "p-0",
                              }}
                              onClick={() => onOptionSelected(item.opt)}
                            />
                          </ListItemPrefix>
                          <Typography
                            color="blue-gray"
                            className=" font-normal text-sm text-white"
                          >
                            {item.title}
                          </Typography>
                        </label>
                      </ListItem>
                    );
                  })}
                </List>
              </Card>
            </div>
          )}
        </div>
        <div className="fixed bottom-0 py-4 px-2 font-normal text-sm text-white font-poppins">
          Developed by @Ibnuard
        </div>
      </div>
      <div className=" md:h-screen md:w-screen">
        <Tldraw
          renderDebugMenuItems={null}
          inferDarkMode
          persistenceKey="drawcode"
        >
          <ExportButton
            target={target}
            option={selectedOption}
            setResult={setResult}
            setOnLoading={setOnLoading}
          />
        </Tldraw>
        {result &&
          ReactDOM.createPortal(
            <div
              className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center"
              style={{ zIndex: 2000, backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <ResultModal
                setResult={setResult}
                html={result}
                target={target + selectedOption}
              />
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};

// Export button
const ExportButton = ({ target, setResult, option, setOnLoading }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const editor = useEditor();

  React.useEffect(() => {
    setOnLoading(isLoading);
  }, [isLoading]);

  const generatePrompt = target + option;

  // Upload image
  async function uploadSketch(image) {
    console.log("Uploading sketch...");

    const base64Prefix = "data:image/[^;]+;base64,";
    const regex = new RegExp(base64Prefix);
    const cleanImage = image.replace(regex, "");

    const body = {
      image: cleanImage,
    };

    try {
      const res = await fetch("http://localhost:4000/uploadImage", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      });

      const resJson = await res.json();

      if (resJson) {
        await generateCode(resJson.imageUrl);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // generate code
  async function generateCode(image) {
    console.log("Generating Code for " + generatePrompt);
    const body = JSON.stringify({
      image: image,
      prompt: generatePrompt,
    });

    try {
      const resp = await fetch("http://127.0.0.1:4000/ask", {
        method: "POST",
        body: body,
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      });

      const result = await resp.json();
      const resultData = result.data;
      const content = extractCodeValueUsingRegex(resultData, generatePrompt);

      setResult(content);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  return (
    <Button
      color="blue"
      disabled={!target || isLoading}
      onClick={async (e) => {
        setIsLoading(true);
        try {
          e.preventDefault();
          const svg = await editor.getSvg(
            Array.from(editor.currentPageShapeIds)
          );

          if (!svg) {
            return;
          }
          const png = await svgToPng(svg, {
            type: "png",
            quality: 1,
            scale: 1,
          });

          const dataUrl = await blobToBase64(png);

          await uploadSketch(dataUrl);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }}
      className="top-24 invisible md:visible md:left-0 lg:left-2 w-60 normal-case font-poppins"
      style={{ zIndex: 1000, position: "absolute" }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center ">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        </div>
      ) : (
        "See The Magic ✨"
      )}
    </Button>
  );
};

export default Canvas;
