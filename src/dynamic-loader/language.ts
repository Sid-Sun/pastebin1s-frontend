import { StreamLanguage } from "@codemirror/language";
import { Extension } from "@codemirror/state";
import { useSnippetStore } from "../snippetStore";

const handleLanguageChange = (snippetID: number) => {
  // get the language from the snippet store
  // and create a method to the language extension
  const snippet = useSnippetStore.getState().snippets[snippetID];
  if (snippet === undefined) {
    return;
  }
  const language = snippet.language;
  const setLanguageExtension = (lang?: Extension) => {
    useSnippetStore
      .getState()
      .updateSnippet(snippetID, { languageExtension: lang });
  };

  switch (language) {
    case "plaintext":
      setLanguageExtension(undefined);
      break;
    case "cpp":
      import("@codemirror/lang-cpp").then((lang) => {
        setLanguageExtension(lang.cppLanguage);
      });
      break;
    case "html":
      import("@codemirror/lang-html").then((lang) => {
        setLanguageExtension(lang.htmlLanguage);
      });
      break;
    case "java":
      import("@codemirror/lang-java").then((lang) => {
        setLanguageExtension(lang.javaLanguage);
      });
      break;
    case "javascript":
      import("@codemirror/lang-javascript").then((lang) => {
        setLanguageExtension(lang.javascriptLanguage);
      });
      break;
    case "json":
      import("@codemirror/lang-json").then((lang) => {
        setLanguageExtension(lang.jsonLanguage);
      });
      break;
    case "markdown":
      import("@codemirror/lang-markdown").then((langExtension) => {
        import("@codemirror/language-data").then((languageData) => {
          setLanguageExtension(
            langExtension.markdown({
              base: langExtension.markdownLanguage,
              codeLanguages: languageData.languages,
            }),
          );
        });
      });
      break;
    case "python":
      import("@codemirror/lang-python").then((lang) => {
        setLanguageExtension(lang.pythonLanguage);
      });
      break;
    case "rust":
      import("@codemirror/lang-rust").then((lang) => {
        setLanguageExtension(lang.rustLanguage);
      });
      break;
    case "xml":
      import("@codemirror/lang-xml").then((lang) => {
        setLanguageExtension(lang.xmlLanguage);
      });
      break;
    // legacy language support
    case "dockerfile":
      import("@codemirror/legacy-modes/mode/dockerfile").then((lang) => {
        setLanguageExtension(StreamLanguage.define(lang.dockerFile));
      });
      break;
    case "go":
      import("@codemirror/legacy-modes/mode/go").then((lang) => {
        setLanguageExtension(StreamLanguage.define(lang.go));
      });
      break;
    case "jinja2":
      import("@codemirror/legacy-modes/mode/jinja2").then((lang) => {
        setLanguageExtension(StreamLanguage.define(lang.jinja2));
      });
      break;
    case "swift":
      import("@codemirror/legacy-modes/mode/swift").then((lang) => {
        setLanguageExtension(StreamLanguage.define(lang.swift));
      });
      break;
    case "toml":
      import("@codemirror/legacy-modes/mode/toml").then((lang) => {
        setLanguageExtension(StreamLanguage.define(lang.toml));
      });
      break;
    case "yaml":
      import("@codemirror/legacy-modes/mode/yaml").then((lang) => {
        setLanguageExtension(StreamLanguage.define(lang.yaml));
      });
      break;
  }
};

export default handleLanguageChange;
