import React from "react";
import { useEditorStore } from "../../editorStore";
import { useSnippetStore } from "../../snippetStore";
import Snippet from "../snippet/snippet";

function SnippetContainer() {
  const snippets = useSnippetStore.use.snippets()
  const createSnippet = useSnippetStore.use.createSnippet()
  const readOnly = useEditorStore.use.readOnly()
  const { splitPane, setSplitPane } = useEditorStore(state => ({ splitPane: state.splitPane, setSplitPane: state.setSplitPane }))
  const { desktopView } = useEditorStore(state => ({ desktopView: state.desktopView }))

  return (<React.Fragment>
    <h4 className="font-mono text-xl pb-4 mt-6">Snippets</h4>
    <div className="flex justify-center space-y-2 flex-col">
      {snippets.map((item, index) => {
        return <Snippet key={item.uuid} index={index} />
      })}
    </div>
    {!readOnly && <div className="flex justify-center mt-4 items-stretch">
      <button onClick={() => { createSnippet() }} className={"inline-block mx-auto w-full h-10 px-6 py-2.5 bg-rose-200 active:bg-rose-600 active:text-white "+ (desktopView?"hover:bg-rose-600 hover:text-white": "") +" text-black font-medium font-mono text-base leading-tight rounded shadow-lg hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out"}>
        <p>Add New Snippet</p>
      </button>
    </div>}
    {snippets.length >= 2 && desktopView && <div className="flex justify-center mt-2 items-stretch">
      <button onClick={() => { setSplitPane(!splitPane) }} className={"inline-block mx-auto w-full h-10 px-6 py-2.5 bg-fuchsia-200 active:bg-fuchsia-600 active:text-white " + (desktopView? "hover:bg-fuchsia-600 hover:text-white" : "") + " text-black font-medium font-mono text-base leading-tight rounded shadow-lg hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out flex items-center justify-center"}>
        <span>{splitPane ? "Unsplit" : "Split"}</span>
        <span className="material-symbols-outlined text-md" style={{fontWeight: 200}}>
          splitscreen_right
        </span>
        <span>{"Editor"}</span>
      </button>
    </div>}
  </React.Fragment>);
}

export default SnippetContainer;
