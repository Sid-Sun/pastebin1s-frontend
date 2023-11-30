import React from "react";
import { useEditorStore } from "../../editorStore";

function EditorOptions() {
  let { theme, setTheme } = useEditorStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }));
  let { fontSize, setFontSize } = useEditorStore((state) => ({
    fontSize: state.fontSize,
    setFontSize: state.setFontSize,
  }));
  let { wrapLines, setWrapLines } = useEditorStore((state) => ({
    wrapLines: state.wrapLines,
    setWrapLines: state.setWrapLines,
  }));

  return (
    <React.Fragment>
      <h4 className="mt-6 pb-1 font-mono text-xl">Preferences</h4>
      <div className="items-center">
        <label htmlFor="theme" className="pb-2 text-center font-mono">
          Theme:
        </label>
        <select
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="form-select mx-0 mt-0.5 block h-10 w-full appearance-none rounded border border-solid border-pink-50 bg-pink-50 bg-clip-padding bg-no-repeat px-1 py-0.5 font-mono text-base text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
        >
          <option value="aura">Aura Dark</option>
          <option value="github-dark">GitHub Dark</option>
          <option value="bbedit">BBEdit Light</option>
        </select>
      </div>
      <div className="mt-2">
        <label htmlFor="fontSize" className="text-center font-mono">
          Font Size
        </label>
        <br />
        <input
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          value={fontSize}
          type="range"
          id="fontSize"
          max="26"
          min="10"
          step="1"
          className="form-check-input h-8 w-full accent-pink-600"
        />
      </div>
      <div className="form-check mt-1 items-stretch">
        <input
          checked={wrapLines}
          onChange={() => setWrapLines(!wrapLines)}
          type="checkbox"
          id="wordwrap"
          className="form-check-input accent-pink-600"
        />
        <label htmlFor="wordwrap" className="pl-2 text-center font-mono">
          Wrap Text
        </label>
      </div>
    </React.Fragment>
  );
}

export default EditorOptions;
