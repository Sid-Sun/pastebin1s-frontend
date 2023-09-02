import { Fragment } from "react"
import { useEditorStore } from "../editorStore"
import EditorOptions from "./EditorOptions/EditorOptions"
import SnippetContainer from "./SnippetContainer/SnippetContainer"
import SnippetOptions from "./SnippetOptions/SnippetOptions"

interface menubarProps {
  id?: string
  save: () => void
  duplicateAndEdit: () => void
}

function MenuBar(props: menubarProps) {
  let showBranding = !useEditorStore.use.menuOpen()
  let alert = useEditorStore.use.alert()
  let loading = useEditorStore.use.loading()
  let readOnly = useEditorStore.use.readOnly()

  return (
    <Fragment>
      <div className="bg-gray-800 text-white min-h-screen max-h-screen overflow-auto">
        {showBranding && <div className="p-8 bg-purple-800">
          <a className="font-mono text-center text-2xl block" href="/">PASTEBIN(1s)</a>
        </div>}
        <div className="px-4">
          <div>
            <SnippetOptions />
            <SnippetContainer />
            <EditorOptions />
            <div className="flex space-x-2 justify-center">
              {!readOnly && <button disabled={loading} onClick={props.save} className="mt-2 inline-block w-full h-10 px-6 py-2.5 bg-purple-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-lg hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                <p>Save</p>
              </button>}
              {readOnly && <button disabled={loading} onClick={props.duplicateAndEdit} type="button" className="mt-2 inline-block w-full h-10 px-6 py-2.5 mt-3 bg-purple-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-lg hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" >
                Duplicate and Edit
              </button>}
            </div>
          </div>
          {
            props.id && <div className="flex space-x-2 justify-center mt-3">
              <a type="button" href={"https://pastebin.com/raw/" + props.id} className="inline-block w-full h-10 px-6 py-2.5 bg-pink-700 text-center text-white font-medium text-xs leading-tight uppercase rounded shadow-lg hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" >
                raw
              </a>
            </div>
          }
          {
            props.id && <div className="flex space-x-2 justify-center mt-3">
              <a type="button" href={"https://pastebin.com/" + props.id} className="inline-block w-full h-10 px-6 py-2.5 bg-green-700 text-center text-white font-medium text-xs leading-tight uppercase rounded shadow-lg hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" >
                Go to Pastebin
              </a>
            </div>
          }
          {(alert !== '') &&
            <div className="my-3 py-2 bg-gray-300 text-gray-900 rounded-md text-sm border border-gray-400 flex" >
              <span>{alert}</span>
            </div>}
          <div>
            <a className="font-mono text-center text-l mt-4 mb-3 cursor-pointer block" href="https://pastebin1s.com/Ethhhtda">About</a>
            <a className="font-mono text-center text-l my-3  cursor-pointer block" href="https://github.com/sid-sun/pastebin1s-frontend" rel="noreferrer" target="_blank">GitHub</a>
            <a className="font-mono text-center text-l my-3 cursor-pointer block" href="https://pastebin1s.com/0ePz2c2d">Privacy Policy</a>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default MenuBar
