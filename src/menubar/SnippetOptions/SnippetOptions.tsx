
import { Fragment } from "react";
import { useEditorStore } from "../../editorStore"
import { useSnippetStore } from "../../snippetStore"
import LanguageSelector from "./LanguageSelector";

function SnippetOptions() {
  let loading = useEditorStore.use.loading()
  let { ephemeral, setEphemeral } = useSnippetStore(state => ({ ephemeral: state.ephemeral, setEphemeral: state.setEphemeral }))
  let { enableAllLanguages, setEnableAllLanguages } = useEditorStore(state => ({ enableAllLanguages: state.enableAllLanguages, setEnableAllLanguages: state.setEnableAllLanguages }))
  let readOnly = useEditorStore.use.readOnly()
  const splitPane = useEditorStore.use.splitPane()


  let snippets = useSnippetStore.use.snippets()
  const primarySnippet = snippets[0]
  let primaryLanguage = primarySnippet.language
  let setPrimaryLanguage = (language: string) => {
    useSnippetStore.getState().updateSnippet(0, {
      language,
    })
  }
  const secondarySnippet = snippets[1]
  let secondaryLanguage = secondarySnippet?.language
  let setSecondaryLanguage = (language: string) => {
    useSnippetStore.getState().updateSnippet(1, {
      language,
    })
  }

  return (<Fragment>
    <h4 className="font-mono text-center text-xl py-4">Snippet Options</h4>
    <div className="items-center form-check pb-0 mx-0">
      <input disabled={loading} checked={enableAllLanguages} onChange={() => setEnableAllLanguages(!enableAllLanguages)} type="checkbox" id="showAll" className="form-check-input" />
      <label htmlFor="showAll" className="text-center font-mono pl-2">Show All Languages</label>
    </div>
    <LanguageSelector language={primaryLanguage} setLanguage={setPrimaryLanguage} label={snippets.length > 1 ? "Snippet 1 Language:" : "Language:"} />
    {splitPane && <LanguageSelector language={secondaryLanguage} setLanguage={setSecondaryLanguage} label="Snippet 2 Language:" />}
    {!readOnly &&
      <div className="items-stretch form-check py-3">
        <input disabled={readOnly || loading} checked={ephemeral} onChange={() => setEphemeral(!ephemeral)} type="checkbox" id="ephemeral" className="form-check-input" />
        <label htmlFor="ephemeral" className="text-center font-mono pl-2">Delete after 1 month</label>
      </div>
    }
  </Fragment >);
}

export default SnippetOptions;
