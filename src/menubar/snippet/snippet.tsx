import React from "react";
import { useEditorStore } from "../../editorStore";
import langExtensions from './langExtensions'
import { useSnippetStore } from "../../snippetStore";
interface snippetProps {
  index: number
}

function Snippet(props: snippetProps) {
  const snippets = useSnippetStore.use.snippets()
  const selectedSnippet = snippets[props.index]
  const readOnly = useEditorStore.use.readOnly()
  const splitPane = useEditorStore.use.splitPane()
  const desktopView = useEditorStore.use.desktopView()

  return (
    <React.Fragment>
      <div className="inline-flex flex-none h-10">
        {snippets.length > 1 && <button disabled={props.index === 0} onClick={() => { useSnippetStore.getState().makeSnippetPrimary(props.index) }} className="w-12 bg-purple-800 hover:bg-gray-400 text-white font-bold py-2 px-2 rounded-l">
          <p>&lt;-</p>
        </button>}
        <button className={"w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold" + (snippets.length == 1? " rounded-l" : "")}>
          <p>{selectedSnippet.name+"."+langExtensions[selectedSnippet.language]}</p>
        </button>
        {snippets.length > 1 && splitPane && desktopView && <button disabled={props.index === 1} onClick={() => { useSnippetStore.getState().makeSnippetSecondary(props.index) }} className="w-12 bg-green-800 hover:bg-gray-400 text-white font-bold py-2 px-2">
          <p>-&gt;</p>
        </button>}
        {!readOnly && <button onClick={() => { useSnippetStore.getState().removeSnippet(props.index) }} className="w-12 bg-red-600 hover:bg-gray-400 text-white font-bold py-2 px-2 rounded-r">
          <p>X</p>
        </button>}
      </div>
    </React.Fragment>)
}

export default Snippet
