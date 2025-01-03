import { Extension } from "@codemirror/state";
import { useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";
import MenuBar from "./menubar";
import NavBar from "./navbar/navbar";

import getFontSizeExtension from "./fonts";
import useWindowDimensions from "./dimensions";
import { handleLanguageChange, handleThemeChange } from "./dynamic-loader";
import { RestService } from "./service/rest";

import { Snippet, useSnippetStore } from "./snippetStore";
import { useEditorStore } from "./editorStore";
import { FormPrompt } from "./FormPromt";
import { useCodeMirror } from "@uiw/react-codemirror";

const PRIMARY_SNIPPET = 0;
const SECONDARY_SNIPPET = 1;

const PASTEBIN1S_HEADER_V2 = "//<-> ) pastebin1s.com V2 ( <-> \\\\\r\n";

function App() {
  const navigate = useNavigate();
  let params = useParams();
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Snippet Store State
  const snippets = useSnippetStore.use.snippets();
  const setSnippets = useSnippetStore.use.setSnippets();
  const primarySnippet = snippets[0];
  const primaryLanguage = primarySnippet.language;
  const secondarySnippet = snippets[1];
  const secondaryLanguage = secondarySnippet?.language;
  const ephemeral = useSnippetStore.use.ephemeral();

  const setPrimaryDocument = (value: string) => {
    useSnippetStore.getState().updateSnippet(PRIMARY_SNIPPET, {
      document: value,
    });
  };

  // Editor State - Extensions
  const fontSize = useEditorStore.use.fontSize();
  const primaryExtensions = useEditorStore.use.primaryExtensions();
  const secondaryExtensions = useEditorStore.use.secondaryExtensions();
  // Editor State
  const { splitPane, setSplitPane } = useEditorStore((state) => ({
    splitPane: state.splitPane,
    setSplitPane: state.setSplitPane,
  }));
  const wrapLines = useEditorStore.use.wrapLines();
  const { theme, setTheme } = useEditorStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }));
  const themeExtension = useEditorStore.use.themeExtension();
  const { desktopView } = useEditorStore((state) => ({
    desktopView: state.desktopView,
  }));
  const dimensions = useEditorStore.use.dimensions();
  const { menuOpen, setMenuOpen } = useEditorStore((state) => ({
    menuOpen: state.menuOpen,
    setMenuOpen: state.setMenuOpen,
  }));
  const { readOnly, setReadOnly } = useEditorStore((state) => ({
    readOnly: state.readOnly,
    setReadOnly: state.setReadOnly,
  }));
  const { loading, setLoading } = useEditorStore((state) => ({
    loading: state.loading,
    setLoading: state.setLoading,
  }));
  const { editorHeight, setEditorHeight } = useEditorStore((state) => ({
    editorHeight: state.editorHeight,
    setEditorHeight: state.setEditorHeight,
  }));
  const { editorWidth, setEditorWidth } = useEditorStore((state) => ({
    editorWidth: state.editorWidth,
    setEditorWidth: state.setEditorWidth,
  }));
  const { alert, setAlert } = useEditorStore((state) => ({
    alert: state.alert,
    setAlert: state.setAlert,
  }));
  const { dismisser, setDismisser } = useEditorStore((state) => ({
    dismisser: state.dismisser,
    setDismisser: state.setDismisser,
  }));

  // interval ID for refreshing snippets with intervals
  const [rif, setRIF] = useState();

  const placeholder = `💖 Pastebin1s is an alternative user-friendly, developer-oriented, mobile-friendly 📱 frontend to pastebin.com 🏳️‍🌈
  🎅 Features:
   🚀 Pastes are stored on pastebin.com
   ✨ Open any pastebin.com paste - just make it pastebin1s.com
   🪟 One editor isn't enough! Add another snippet and the split the editor!
   ⚡ Use curl to create a paste:
   ⌨️ curl --upload-file hello.txt https://pastebin1s.com/api/raw
  ⚠️ pastebin.com API rate-limits creating guest pastes, to bypass this:
   💻 sign up / log in at pastebin.com
   🔑 go to https://pastebin.com/doc_api and copy your "Unique Developer API Key"
   📋 paste it under "custom API key" on pastebin1s.com
  ℹ️ About:
   👩‍💻 Developed and hosted by Sid Sun (sid@sidsun.com) 🏳️‍🌈
   🙇‍♀️ Inspired from github1s.com`;

  const getWidth = () => {
    return (
      (splitPane ? (editorWidth / 2).toString() : editorWidth.toString()) + "px"
    );
  };

  // Editors
  const primaryEditorContainer = useRef<HTMLDivElement>(null);
  const { setContainer: primaryEditorSetContainer, view: primaryEditorView } =
    useCodeMirror({
      autoFocus: true,
      container: primaryEditorContainer.current,
      value: primarySnippet.document,
      readOnly: readOnly || loading,
      theme: themeExtension,
      extensions: primaryExtensions,
      height: editorHeight.toString() + "px",
      width: getWidth(),
      placeholder: placeholder,
    });

  const secondaryEditorContainer = useRef<HTMLDivElement>(null);
  const {
    setContainer: secondaryEditorSetContainer,
    view: secondaryEditorView,
  } = useCodeMirror({
    autoFocus: false,
    container: secondaryEditorContainer.current,
    value: secondarySnippet?.document || "",
    readOnly: readOnly || loading,
    theme: themeExtension,
    extensions: secondaryExtensions,
    height: editorHeight.toString() + "px",
    width: getWidth(),
  });

  // handle window dimensions change
  useWindowDimensions();

  useEffect(() => {
    if (alert === "") {
      return;
    }
    if (dismisser !== undefined) {
      clearTimeout(dismisser);
    }
    setDismisser(
      setTimeout(() => {
        setAlert("");
      }, 5000),
    );
  }, [alert]); // adding other dependencies will cause infinite loop

  const getLanguageExtension = (snippet: Snippet) => {
    switch (snippet.language) {
      case "plaintext":
        break;
      default:
        if (snippet.languageExtension) {
          return snippet.languageExtension;
        }
    }
  };

  // when sources of extensions change
  // generate a new list of extensions
  // and update the editor
  useEffect(() => {
    let newExtensions: Extension[] = Array<Extension>();
    newExtensions.push(getFontSizeExtension(fontSize));
    if (wrapLines) {
      newExtensions.push(EditorView.lineWrapping);
    }
    let secondaryExtensions = [...newExtensions];

    const primarySnippetLanguageExtension =
      getLanguageExtension(primarySnippet);
    if (primarySnippetLanguageExtension !== undefined) {
      newExtensions.push(primarySnippetLanguageExtension);
    }

    if (secondarySnippet !== undefined) {
      const secondarySnippetLanguageExtension =
        getLanguageExtension(secondarySnippet);
      if (secondarySnippetLanguageExtension !== undefined) {
        secondaryExtensions.push(secondarySnippetLanguageExtension);
      }
    }

    useEditorStore.getState().setPrimaryExtensions(newExtensions);
    if (secondarySnippet !== undefined) {
      useEditorStore.getState().setSecondaryExtensions(secondaryExtensions);
    }
  }, [fontSize, primarySnippet, secondarySnippet, wrapLines]);

  // if language changes, then update the language extension
  useEffect(() => {
    handleLanguageChange(PRIMARY_SNIPPET);
    handleLanguageChange(SECONDARY_SNIPPET);
  }, [primaryLanguage, secondaryLanguage]);

  // handle theme change
  // if theme is invalid or deprecated
  // set the new theme name as selected theme
  useEffect(() => {
    const newTheme = handleThemeChange(theme);
    if (newTheme !== theme) {
      // the theme name was either invalid or theme has been deprecated
      // set the new theme name as selected theme
      setTheme(newTheme);
    }
  }, [theme, setTheme]); // only runs when theme changes

  // load snippet from pastebin
  // if id is present in url
  // and document is empty
  useEffect(() => {
    if (params.id) {
      setReadOnly(true);
      setLoading(true);
      let snippetPromise = undefined;
      const restLoader = new RestService(setAlert);
      snippetPromise = restLoader.load(params.id);
      snippetPromise
        .then((snippet) => {
          // Convert back to array
          const snips = snippet.data.split(
            PASTEBIN1S_HEADER_V2,
          );
          if (snips.length !== 2) {
            setPrimaryDocument(snippet.data);
            setLoading(false);
            return;
          }
          const parsedSnippets: Snippet[] = JSON.parse(snips[1]);
          setSnippets(parsedSnippets);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          switch (e.response.status) {
            case 403:
            case 404:
              setAlert("snippet not found");
              setTimeout(() => {
                onDuplicateAndEdit();
                setLoading(false);
                setPrimaryDocument("");
              }, 5000);
              break;
            default:
              console.error(e);
              setAlert("something went wrong: " + e);
              setPrimaryDocument("something went wrong: " + e);
              setTimeout(() => {
                onDuplicateAndEdit();
                setLoading(false);
                setPrimaryDocument("");
              }, 5000);
          }
        });
    } else {
      navigate("/");
    }
  }, []); // only runs on mount

  const onSave = () => {
    // Snippet2 is Snippet without languageExtension
    interface Snippet2 {
      uuid: string;
      name: string;
      language: string;
      document: string;
    }
    const validSnippets: Array<Snippet2> = snippets
      .filter((snippet) => snippet.document !== "")
      .map((snippet) => {
        return {
          uuid: snippet.uuid,
          name: snippet.name,
          language: snippet.language,
          document: snippet.document,
        };
      });
    if (validSnippets.length === 0) {
      setAlert("nothing to save");
      return;
    }

    let document: string = PASTEBIN1S_HEADER_V2;
    document += JSON.stringify(validSnippets);

    setReadOnly(true);
    setLoading(true);

    new RestService(setAlert)
      .save({
        data: document,
        metadata: {
          id: "placeholder",
          ephemeral: ephemeral,
        },
      })
      .then((res) => {
        navigate("/" + res);
        setAlert("saved");
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setReadOnly(false);
        console.log(e);
        setAlert("something went wrong: " + e);
      });
  };

  const onDuplicateAndEdit = () => {
    setReadOnly(false);
    navigate("..");
  };

  // handle window width change
  useEffect(() => {
    if (desktopView) {
      setMenuOpen(false);
    } else {
      setSplitPane(false);
    }
    setEditorHeight(desktopView ? dimensions.height : dimensions.height - 60);
    if (editorContainerRef.current) {
      setEditorWidth(editorContainerRef.current.offsetWidth);
    }
  }, [
    desktopView,
    dimensions,
    setMenuOpen,
    setEditorHeight,
    setEditorWidth,
    setSplitPane,
  ]);

  useEffect(() => {
    if (secondarySnippet === undefined) {
      setSplitPane(false);
    }
  }, [secondarySnippet, setSplitPane]);

  FormPrompt({
    hasUnsavedChanges:
      !readOnly &&
      (primarySnippet.document !== "" ||
        (secondarySnippet && secondarySnippet.document !== "")),
  });

  useEffect(() => {
    if (primaryEditorContainer.current) {
      primaryEditorSetContainer(primaryEditorContainer.current);
    }
  }, [primaryEditorContainer, menuOpen]);

  useEffect(() => {
    if (secondaryEditorContainer.current) {
      secondaryEditorSetContainer(secondaryEditorContainer.current);
    }
    // we need splitPane here to make editor mount properly
  }, [secondaryEditorContainer, splitPane, menuOpen]);

  useEffect(() => {
    if (primaryEditorView !== undefined) {
      // make sure there is no existing interval
      // console.log('NEW INTERVAL INCOMING')
      if (rif !== undefined) {
        clearInterval(rif);
      }
      let intevalID = setInterval(() => {
        if (primaryEditorView) {
          const currentDoc = primaryEditorView.state.doc.sliceString(0);
          if (
            useSnippetStore.getState().snippets[PRIMARY_SNIPPET].document !==
            currentDoc
          ) {
            useSnippetStore.getState().updateSnippet(PRIMARY_SNIPPET, {
              document: currentDoc,
            });
          }
        }
        if (secondaryEditorView) {
          const currentDoc = secondaryEditorView.state.doc.sliceString(0);
          if (
            useSnippetStore.getState().snippets[SECONDARY_SNIPPET].document !==
            currentDoc
          ) {
            useSnippetStore.getState().updateSnippet(SECONDARY_SNIPPET, {
              document: currentDoc,
            });
          }
        }
      }, 1000);
      // @ts-ignore - stupid TS thinks we are calling nodeJS setInterval
      setRIF(intevalID);
    }
  }, [primaryEditorView, secondaryEditorView]);

  return (
    <div>
      {!desktopView && <NavBar />}
      <div className="flex">
        <div
          className="flex lg:w-3/4 xl:w-4/5 2xl:w-5/6"
          ref={editorContainerRef}
        >
          {!menuOpen && (
            <div className={splitPane ? "w-1/2" : "w-screen"}>
              <div ref={primaryEditorContainer} />
            </div>
          )}
          {!menuOpen && snippets.length >= 2 && splitPane && (
            <div className="w-1/2" style={{ order: 2 }}>
              <div ref={secondaryEditorContainer} />
            </div>
          )}
        </div>
        {(menuOpen || desktopView) && (
          <div className="w-full lg:w-1/4 xl:w-1/5 2xl:w-1/6">
            <MenuBar
              duplicateAndEdit={onDuplicateAndEdit}
              id={readOnly ? params.id : undefined}
              save={onSave}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
