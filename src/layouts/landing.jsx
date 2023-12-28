import { Button } from "@material-tailwind/react";
import Typewriter from "typewriter-effect";
import { useNavigate } from "react-router-dom";
import { LandingBg } from "../components/LandingBg";
import Footer from "../components/footer";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      <LandingBg />
      <div className="min-h-screen grid place-items-center">
        <div className=" w-full">
          <div className=" text-center p-8">
            <div className="text-6xl text-white font-bold py-2 font-bunge">
              Drawcode
            </div>
            <Typewriter
              options={{
                wrapperClassName: "text-md text-white font-medium font-poppins",
                cursorClassName: "text-md text-white",
                delay: 75,
                loop: true,
                autoStart: true,
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    "Turn sketches to html, react native and flutter using AI."
                  )
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString("Draw it yourself...")
                  .pauseFor(1000)
                  .start();
              }}
            />
          </div>
          <div className="flex flex-col items-center gap-y-4">
            <Button
              size="lg"
              className="w-72 normal-case font-poppins"
              color="blue"
              onClick={() => navigate("draw")}
            >
              Start Drawing
            </Button>
            <Button
              variant="outlined"
              size="lg"
              className="w-72 normal-case font-poppins"
              color="white"
              onClick={() => navigate("sscode")}
            >
              Generate Code from Screenshoot
            </Button>
            <a
              a
              href="https://github.com/Ibnuard"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="text"
                size="lg"
                className="w-72 normal-case font-poppins"
                color="white"
              >
                Follow me on Github
              </Button>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

Landing.displayName = "/src/layout/landing.jsx";

export default Landing;
