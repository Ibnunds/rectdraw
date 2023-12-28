import { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-cshtml";
import "prismjs/themes/prism-tomorrow.css";

export function ResultModal({ html, setResult, target }) {
  const [activeTab, setActiveTab] = useState("code");

  console.log(target);

  useEffect(() => {
    const highlight = async () => {
      await Prism.highlightAll();
    };
    highlight();
  }, [html, activeTab]);

  if (!html) {
    return null;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className=" bg-gray-800 rounded-lg shadow-xl flex flex-col"
      style={{
        width: "calc(100% - 128px)",
        height: "calc(100% - 96px)",
      }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex space-x-1">
          <TabButton
            active={activeTab === "code"}
            onClick={() => {
              setActiveTab("code");
            }}
          >
            Code
          </TabButton>
          {target == "HTMLCSS" && (
            <TabButton
              active={activeTab === "preview"}
              onClick={() => {
                setActiveTab("preview");
              }}
            >
              Preview HTML
            </TabButton>
          )}
          {target == "HTMLTAILWIND" && (
            <TabButton
              active={activeTab === "preview"}
              onClick={() => {
                setActiveTab("preview");
              }}
            >
              Preview HTML
            </TabButton>
          )}
        </div>

        <button
          className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring"
          onClick={() => {
            setResult(null);
          }}
        >
          <svg
            className="w-6 h-6 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      {activeTab === "preview" ? (
        <iframe className="w-full h-full" srcDoc={html} />
      ) : (
        <pre className="overflow-auto p-4">
          <code className="language-markup">{html}</code>
        </pre>
      )}
    </div>
  );
}

function TabButton({ active, ...buttonProps }) {
  const className = active
    ? "px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md focus:outline-none focus:ring"
    : "px-4 py-2 text-sm font-medium text-blue-500 bg-transparent hover:bg-blue-100 focus:bg-blue-100 rounded-md focus:outline-none focus:ring";
  return <button className={className} {...buttonProps}></button>;
}
