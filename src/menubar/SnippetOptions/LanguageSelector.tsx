import React from "react";
import { useEditorStore } from "../../editorStore";
interface languageSelectProps {
  uid: string;
  label: string;
  language: string;
  setLanguage: (language: string) => void;
}

function LanguageSelector(props: languageSelectProps) {
  const enableAllLanguages = useEditorStore.use.enableAllLanguages();
  const { uid, label, language, setLanguage } = props;
  const loading = useEditorStore.use.loading();

  return (
    <React.Fragment>
      <div className="my-1 items-center">
        <label htmlFor={uid} className="pb-2 text-center font-mono">
          {label}
        </label>
        <select
          disabled={loading}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          id={uid}
          className="form-select mx-0 mt-0.5 block h-10 w-full appearance-none rounded border border-solid border-pink-50 bg-pink-50 bg-clip-padding bg-no-repeat px-1 py-0.5 font-mono text-base text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
        >
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
    </React.Fragment>
  );
}

export default LanguageSelector;
