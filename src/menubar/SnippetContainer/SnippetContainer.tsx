import React from "react";
import { useEditorStore } from "../../editorStore";
import { useSnippetStore } from "../../snippetStore";
import Snippet from "../snippet/snippet";

function SnippetContainer() {
  const snippets = useSnippetStore.use.snippets();
  const createSnippet = useSnippetStore.use.createSnippet();
  const makeSnippetPrimary = useSnippetStore.use.makeSnippetPrimary();
  const makeSnippetSecondary = useSnippetStore.use.makeSnippetSecondary();
  const readOnly = useEditorStore.use.readOnly();
  const { splitPane, setSplitPane } = useEditorStore((state) => ({
    splitPane: state.splitPane,
    setSplitPane: state.setSplitPane,
  }));
  const { desktopView } = useEditorStore((state) => ({
    desktopView: state.desktopView,
  }));

  const createSnippetWithSwap = () => { 
    const newSnippetIndex = snippets.length;
    createSnippet();
    switch (splitPane) {
      case true:
        makeSnippetSecondary(newSnippetIndex);
        break;
      case false:
        makeSnippetPrimary(newSnippetIndex);
        break;
    }
  }

  return (
    <React.Fragment>
      <h4 className="mt-6 pb-4 font-mono text-xl">Snippets</h4>
      <div className="flex flex-col justify-center space-y-2">
        {snippets.map((item, index) => {
          return <Snippet key={item.uuid} index={index} />;
        })}
      </div>
      {!readOnly && (
        <div className="mt-4 flex items-stretch justify-center">
          <button
            onClick={() => {
              createSnippetWithSwap();
            }}
            className={
              "mx-auto inline-block h-10 w-full bg-rose-200 px-6 py-2.5 active:bg-rose-600 active:text-white " +
              (desktopView ? "hover:bg-rose-600 hover:text-white" : "") +
              " rounded font-mono text-base font-medium leading-tight text-black shadow-lg transition duration-150 ease-in-out hover:shadow-lg active:shadow-lg"
            }
          >
            <p>Add New Snippet</p>
          </button>
        </div>
      )}
      {snippets.length >= 2 && desktopView && (
        <div className="mt-2 flex items-stretch justify-center">
          <button
            onClick={() => {
              setSplitPane(!splitPane);
            }}
            className={
              "mx-auto inline-block h-10 w-full bg-fuchsia-200 px-6 py-2.5 active:bg-fuchsia-600 active:text-white " +
              (desktopView ? "hover:bg-fuchsia-600 hover:text-white" : "") +
              " flex items-center justify-center rounded font-mono text-base font-medium leading-tight text-black shadow-lg transition duration-150 ease-in-out hover:shadow-lg active:shadow-lg"
            }
          >
            <span>{splitPane ? "Unsplit" : "Split"}</span>
            <span
              className="material-symbols-outlined text-md"
              style={{ fontWeight: 200 }}
            >
              splitscreen_right
            </span>
            <span>{"Editor"}</span>
          </button>
        </div>
      )}
    </React.Fragment>
  );
}

export default SnippetContainer;
