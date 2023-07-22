import React from "react";
import { useSnippetStore } from "../../snippetStore";
interface snippetProps {
  index: number
}

function Snippet(props: snippetProps) {
  const snippet = useSnippetStore.use.snippets()[props.index]
  return (
    <React.Fragment>
      <div className="mx-auto inline-flex flex-none w-100">
        <button onClick={() => { useSnippetStore.getState().makeSnippetPrimary(props.index) }} className="bg-blue-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 rounded-l">
          <p>&lt;-</p>
        </button>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-1">
          <p>{snippet.name}</p>
        </button>
        <button onClick={() => { useSnippetStore.getState().makeSnippetSecondary(props.index) }} className="bg-green-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2">
          <p>-&gt;</p>
        </button>
        <button onClick={() => { useSnippetStore.getState().removeSnippet(props.index) }} className="bg-red-600 hover:bg-gray-400 text-white-800 font-bold py-2 px-2 rounded-r">
          <p>X</p>
        </button>
      </div>
    </React.Fragment>)
}

export default Snippet
