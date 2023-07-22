import React from "react";
import { useSnippetStore } from "../../snippetStore";
import Snippet from "../snippet/snippet";

function SnippetContainer() {
  const snippets = useSnippetStore.use.snippets()
  const createSnippet = useSnippetStore.use.createSnippet()

  return (<React.Fragment>
    <h4 className="font-mono text-center text-x2 pb-4 pt-6">Snippets</h4>
    <div className="flex justify-center space-y-2 flex-col text-center overflow-auto">
      {snippets.map((_, index) => {
        return <Snippet key={index} index={index} />
      })}
    </div>
    <div className="flex justify-center mt-2">
      <button onClick={() => { createSnippet() }} className="inline-block mx-auto w-5/6 px-6 py-2.5 bg-purple-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-lg hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
        <p>New Snippet</p>
      </button>
    </div>
  </React.Fragment>);
}

export default SnippetContainer;
