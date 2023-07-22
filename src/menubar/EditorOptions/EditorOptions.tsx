import React from "react";
import { useEditorStore } from "../../editorStore"

function EditorOptions() {
  let { theme, setTheme } = useEditorStore(state => ({ theme: state.theme, setTheme: state.setTheme }))
  let { fontSize, setFontSize } = useEditorStore(state => ({ fontSize: state.fontSize, setFontSize: state.setFontSize }))
  let { wrapLines, setWrapLines } = useEditorStore(state => ({ wrapLines: state.wrapLines, setWrapLines: state.setWrapLines }))

  return (<React.Fragment>
    <h4 className="font-mono text-center text-xl pb-4 mt-4">Editor Options</h4>
    <div className="items-center">
      <label htmlFor="theme" className="text-center font-mono pb-2">Theme:</label>
      <select id="theme" value={theme} onChange={e => setTheme(e.target.value)} className="form-select h-8 appearance-none block w-full px-1 py-0.5 text-base font-mono text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out mx-0 mt-0.5 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
        <option value="aura">Aura Dark</option>
        <option value="github-dark">GitHub Dark</option>
        <option value="bbedit">BBEdit Light</option>
      </select>
    </div>
    <div className="mt-2">
      <label htmlFor="fontSize" className="text-center font-mono">Font Size</label>
      <br />
      <input onChange={e => setFontSize(parseInt(e.target.value))} value={fontSize} type="range" id="fontSize" max="26" min="10" step="1" className="w-full h-8 form-check-input" />
    </div>
    <div className="items-stretch form-check mt-1">
      <input checked={wrapLines} onChange={() => setWrapLines(!wrapLines)} type="checkbox" id="wordwrap" className="form-check-input" />
      <label htmlFor="wordwrap" className="text-center font-mono pl-2">Wrap Text</label>
    </div>
  </React.Fragment>);
}

export default EditorOptions;
