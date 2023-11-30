import React, { useEffect, useState } from "react";
import { useEditorStore } from "../../editorStore";
import langExtensions from "./langExtensions";
import { useSnippetStore } from "../../snippetStore";
interface snippetProps {
  index: number;
}

function Snippet(props: snippetProps) {
  const snippets = useSnippetStore.use.snippets();
  const selectedSnippet = snippets[props.index];
  const readOnly = useEditorStore.use.readOnly();
  const splitPane = useEditorStore.use.splitPane();
  const desktopView = useEditorStore.use.desktopView();
  let [bgColour, setBgColour] = useState<string>("bgLightShade");
  let [hoverColour, setHoverColour] = useState<string>("pink-600");
  let [rounded, setRounded] = useState<string>("rounded");
  let [leftStyle, setLeftStyle] = useState<string>(
    "w-12 border-r border-r-pink-600 text-" +
      hoverColour +
      (props.index !== 0
        ? " hover:border-" +
          hoverColour +
          " hover:bg-pink-600 hover:text-white "
        : "") +
      " font-bold rounded-l flex items-center justify-center px-2 py-2 text-xs font-light ease-in-out " +
      bgColour +
      " disabled:border-opacity-30",
  );
  let [rightStyle, setRightStyle] = useState<string>(
    "w-12 border-l border-l-pink-600 text-" +
      hoverColour +
      (props.index !== 1
        ? " hover:border-" +
          hoverColour +
          " hover:bg-pink-600 hover:text-white "
        : "") +
      " font-bold flex items-center justify-center px-2 py-2 text-xs font-light rounded-r ease-in-out " +
      bgColour +
      " disabled:border-opacity-30",
  );

  useEffect(() => {
    const bgLightShade = "bg-pink-100";
    const bgDarkShade = "bg-pink-300";
    setBgColour(
      (splitPane ? props.index <= 1 : props.index === 0)
        ? bgLightShade
        : bgDarkShade,
    );
  }, [splitPane, props.index, setHoverColour, setBgColour]);

  useEffect(() => {
    if (splitPane) {
      setRounded("");
    }
    if (snippets.length === 1) {
      setRounded("rounded");
    }
    if (snippets.length > 1 && !splitPane) {
      setRounded("rounded-r");
    }
  }, [snippets.length, splitPane, setRounded]);

  useEffect(() => {
    setLeftStyle(
      "w-12 border-r border-r-pink-600 text-" +
        hoverColour +
        (props.index !== 0
          ? " hover:border-" +
            hoverColour +
            " hover:bg-pink-600 hover:text-white "
          : "") +
        " font-bold rounded-l flex items-center justify-center px-2 py-2 text-xs font-light ease-in-out " +
        bgColour +
        " disabled:border-opacity-30",
    );
    setRightStyle(
      "w-12 border-l border-l-pink-600 text-" +
        hoverColour +
        (props.index !== 1
          ? " hover:border-" +
            hoverColour +
            " hover:bg-pink-600 hover:text-white "
          : "") +
        " font-bold flex items-center justify-center px-2 py-2 text-xs font-light rounded-r ease-in-out " +
        bgColour +
        " disabled:border-opacity-30",
    );
  }, [splitPane, hoverColour, props.index, bgColour]);

  return (
    <React.Fragment>
      <div className={"inline-flex h-10 flex-none"}>
        {snippets.length > 1 && (
          <button
            disabled={props.index === 0}
            onClick={() => {
              useSnippetStore.getState().makeSnippetPrimary(props.index);
            }}
            className={leftStyle}
          >
            <span
              className={
                "material-symbols-outlined " +
                (props.index === 0 ? "opacity-30" : "")
              }
              style={{ fontWeight: 300 }}
            >
              chevron_left
            </span>
          </button>
        )}
        <button
          disabled
          className={
            "text-md w-full truncate font-mono text-gray-800 " +
            rounded +
            " " +
            bgColour
          }
        >
          <p className="px-2 text-left">
            {props.index +
              1 +
              ". " +
              selectedSnippet.name +
              "." +
              langExtensions[selectedSnippet.language]}
          </p>
        </button>
        {snippets.length > 1 && splitPane && desktopView && (
          <button
            disabled={props.index === 1}
            onClick={() => {
              useSnippetStore.getState().makeSnippetSecondary(props.index);
            }}
            className={rightStyle}
          >
            <span
              className={
                "material-symbols-outlined " +
                (props.index === 1 ? "opacity-30" : "")
              }
              style={{ fontWeight: 300 }}
            >
              chevron_right
            </span>
          </button>
        )}
        {!readOnly && (
          <button
            onClick={() => {
              useSnippetStore.getState().removeSnippet(props.index);
            }}
            className={
              "ml-1 w-12 bg-pink-100 active:bg-pink-600 active:text-white" +
              (desktopView ? " hover:bg-red-600 hover:text-white " : "") +
              " rounded px-2 py-2 font-bold text-pink-600 ease-in-out "
            }
          >
            <span
              className="material-symbols-outlined"
              style={{ fontWeight: 200 }}
            >
              delete_forever
            </span>
          </button>
        )}
      </div>
    </React.Fragment>
  );
}

export default Snippet;
