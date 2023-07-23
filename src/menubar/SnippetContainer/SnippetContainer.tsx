import React from "react";
import { useEditorStore } from "../../editorStore";
import { useSnippetStore } from "../../snippetStore";
import Snippet from "../snippet/snippet";

function SnippetContainer() {
  const snippets = useSnippetStore.use.snippets()
  const createSnippet = useSnippetStore.use.createSnippet()
  const { splitPane, setSplitPane } = useEditorStore(state => ({ splitPane: state.splitPane, setSplitPane: state.setSplitPane }))
  const { desktopView } = useEditorStore(state => ({ desktopView: state.desktopView }))

  return (<React.Fragment>
    <h4 className="font-mono text-center text-xl pb-4 mt-0">Snippets</h4>
    <div className="flex justify-center space-y-2 flex-col text-center">
      {snippets.map((item, index) => {
        return <Snippet key={item.uuid} index={index} />
      })}
    </div>
    <div className="flex justify-center mt-4 items-stretch">
      <button onClick={() => { createSnippet() }} className="inline-block mx-auto w-full h-10 px-6 py-2.5 bg-purple-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-lg hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
        <p>New Snippet</p>
      </button>
    </div>
    {snippets.length >= 2 && desktopView && <div className="flex justify-center mt-4 items-stretch">
      <button onClick={() => { setSplitPane(!splitPane) }} className="inline-block mx-auto w-full h-10 px-6 py-2.5 bg-green-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-lg hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
        <p>{splitPane ? "Unsplit Editor" : "Split Editor"}</p>
      </button>
    </div>}
  </React.Fragment>);
}

export default SnippetContainer;
