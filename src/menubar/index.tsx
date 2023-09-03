import { Fragment } from "react"
import { useEditorStore } from "../editorStore"
import EditorOptions from "./EditorOptions/EditorOptions"
import SnippetContainer from "./SnippetContainer/SnippetContainer"
import SnippetOptions from "./SnippetOptions/SnippetOptions"
import { useSnippetStore } from "../snippetStore"

interface menubarProps {
  id?: string
  save: () => void
  duplicateAndEdit: () => void
}

function MenuBar(props: menubarProps) {
  let showBranding = !useEditorStore.use.menuOpen()
  let { ephemeral, setEphemeral } = useSnippetStore(state => ({ ephemeral: state.ephemeral, setEphemeral: state.setEphemeral }))
  let alert = useEditorStore.use.alert()
  let loading = useEditorStore.use.loading()
  let readOnly = useEditorStore.use.readOnly()
  let desktopView = useEditorStore.use.desktopView()

  return (
    <Fragment>
      <div className="bg-gray-800 text-white min-h-screen max-h-screen overflow-auto">
        {showBranding && <div className="p-8 bg-fuchsia-800">
          <a className="font-mono text-center text-2xl block" href="/">PASTEBIN(1s)</a>
        </div>}
        <div className="px-4">
          <div>
            <div>
              <h4 className="font-mono text-xl pb-4 mt-6">Paste Actions</h4>
              <div className="flex space-x-2 justify-center">
                {!readOnly && <button disabled={loading} onClick={props.save} className={"inline-block w-full h-10 px-6 py-2.5 bg-pink-600 active:bg-pink-300 "+ (desktopView? "hover:bg-pink-300 hover:text-black" : "") +" text-white font-medium font-mono text-md leading-tight rounded shadow-lg transition duration-150 ease-in-out"}>
                  <p>Save Snippets</p>
                </button>}
                {readOnly && <button disabled={loading} onClick={props.duplicateAndEdit} type="button" className={"inline-block w-full h-10 px-6 py-2.5 bg-pink-600 active:bg-pink-300 " + (desktopView? "hover:bg-pink-300 hover:text-black" : "") + " text-white font-medium font-mono text-md leading-tight rounded shadow-lg transition duration-150 ease-in-out"} >
                  Duplicate and Edit
                </button>}
              </div>
              {props.id && <div className="flex space-x-2 justify-center mt-3">
                <a type="button" href={"https://pastebin.com/raw/" + props.id} className={"inline-block mx-auto w-full h-10 px-6 py-2.5 bg-rose-200 active:bg-rose-600 active:text-white " + (desktopView ? "hover:bg-rose-600 hover:text-white" : "") + " text-black font-medium font-mono text-base leading-tight rounded shadow-lg hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out text-center"} >
                  Go to paste raw URL
                </a>
              </div>}
              {props.id && <div className="flex space-x-2 justify-center mt-3">
                <a type="button" href={"https://pastebin.com/" + props.id} className={"inline-block mx-auto w-full h-10 px-6 py-2.5 bg-fuchsia-200 active:bg-fuchsia-600 active:text-white " + (desktopView? "hover:bg-fuchsia-600 hover:text-white" : "") + " text-black font-medium font-mono text-base leading-tight rounded shadow-lg hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out text-center"} >
                  Go to Pastebin
                </a>
              </div>}
              {!readOnly && <div className="items-stretch form-check pt-3">
                  <input disabled={readOnly || loading} checked={ephemeral} onChange={() => setEphemeral(!ephemeral)} type="checkbox" id="ephemeral" className="form-check-input accent-pink-600" />
                  <label htmlFor="ephemeral" className="text-center font-mono pl-2">Auto-Delete after 1 month</label>
              </div>}
            </div>
            <SnippetOptions />
            <SnippetContainer />
            <EditorOptions />
        </div>
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
        <div className="text-center text-sm my-8 font-mono mx-1">
            <p>Designed by <a href="https://chakshu.design" target="_blank">Chakshu Khanna</a> in California</p>
            <p>Made in China by Sid</p>
            <br/>
            <p>Copyright © 2023 CCP.</p>
         </div>
      </div>
    </Fragment>
  )
}

export default MenuBar
