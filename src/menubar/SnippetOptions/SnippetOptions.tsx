import { Fragment } from "react";
import { useEditorStore } from "../../editorStore";
import { useSnippetStore } from "../../snippetStore";
import LanguageSelector from "./LanguageSelector";

function SnippetOptions() {
  let loading = useEditorStore.use.loading();
  let { enableAllLanguages, setEnableAllLanguages } = useEditorStore(
    (state) => ({
      enableAllLanguages: state.enableAllLanguages,
      setEnableAllLanguages: state.setEnableAllLanguages,
    }),
  );
  const splitPane = useEditorStore.use.splitPane();

  let snippets = useSnippetStore.use.snippets();
  const primarySnippet = snippets[0];
  let primaryLanguage = primarySnippet.language;
  let setPrimaryLanguage = (language: string) => {
    useSnippetStore.getState().updateSnippet(0, {
      language,
    });
  };
  const secondarySnippet = snippets[1];
  let secondaryLanguage = secondarySnippet?.language;
  let setSecondaryLanguage = (language: string) => {
    useSnippetStore.getState().updateSnippet(1, {
      language,
    });
  };

  return (
    <Fragment>
      <h4 className="mt-6 pb-1 font-mono text-xl">Snippet Options</h4>
      <LanguageSelector
        language={primaryLanguage}
        setLanguage={setPrimaryLanguage}
        label={snippets.length > 1 ? "Snippet 1 Language:" : "Language:"}
      />
      {splitPane && (
        <LanguageSelector
          language={secondaryLanguage}
          setLanguage={setSecondaryLanguage}
          label="Snippet 2 Language:"
        />
      )}
      <div className="form-check mx-0 mt-2 items-center pb-0">
        <input
          disabled={loading}
          checked={enableAllLanguages}
          onChange={() => setEnableAllLanguages(!enableAllLanguages)}
          type="checkbox"
          id="showAll"
          className="form-check-input accent-pink-600"
        />
        <label htmlFor="showAll" className="pl-2 text-center font-mono">
          Show All Languages
        </label>
      </div>
    </Fragment>
  );
}

export default SnippetOptions;
