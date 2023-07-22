import React from "react";
import { useEditorStore } from "../../editorStore"
interface languageSelectProps {
  label: string;
  language: string;
  setLanguage: (language: string) => void;
}

function LanguageSelector(props: languageSelectProps) {
  const enableAllLanguages = useEditorStore.use.enableAllLanguages();
  const { label, language, setLanguage } = props;
  const loading = useEditorStore.use.loading()

  return (<React.Fragment>
    <div className="items-center mt-0">
      <label htmlFor="language" className="text-center font-mono pb-2">{label}</label>
      <select disabled={loading} value={language} onChange={e => setLanguage(e.target.value)} id="language" className="h-8 form-select appearance-none block w-full px-1 py-0.5 text-base font-mono text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out mx-0 mt-0.5 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
        <option value="cpp">c++</option>
        {enableAllLanguages && <option value="dockerfile">dockerfile</option>}
        <option value="go">go</option>
        {enableAllLanguages && <option value="html">html</option>}
        {enableAllLanguages && <option value="java">java</option>}
        <option value="javascript">javascript</option>
        {enableAllLanguages && <option value="jinja2">jinja2</option>}
        {enableAllLanguages && <option value="json">json</option>}
        <option value="markdown">markdown</option>
        <option value="plaintext">plaintext</option>
        <option value="python">python</option>
        {enableAllLanguages && <option value="rust">rust</option>}
        {enableAllLanguages && <option value="swift">swift</option>}
        {enableAllLanguages && <option value="toml">toml</option>}
        {enableAllLanguages && <option value="xml">xml</option>}
        {enableAllLanguages && <option value="yaml">yaml</option>}
      </select>
    </div>
  </React.Fragment>);
}

export default LanguageSelector;
