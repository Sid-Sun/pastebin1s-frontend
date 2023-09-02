import CodeMirror from '@uiw/react-codemirror';
import { Extension } from "@codemirror/state";
import { useEffect, useRef } from 'react';
import { EditorView } from "@codemirror/view";
import { useNavigate, useParams } from "react-router-dom";
import './App.css';
import MenuBar from './menubar'
import NavBar from './navbar/navbar'

import getFontSizeExtension from './fonts'
import useWindowDimensions from './dimensions';
import { handleLanguageChange, handleThemeChange } from './dynamic-loader';
import { RestService } from './service/rest';

import { Snippet, useSnippetStore } from './snippetStore';
import { useEditorStore } from './editorStore';

const PRIMARY_SNIPPET = 0
const SECONDARY_SNIPPET = 1

function App() {
  const navigate = useNavigate()
  let params = useParams();
  const editorContainerRef = useRef<HTMLDivElement>(null)

  // Snippet Store State
  const snippets = useSnippetStore.use.snippets()
  const setSnippets = useSnippetStore.use.setSnippets()
  const primarySnippet = snippets[0]
  const primaryLanguage = primarySnippet.language
  const secondarySnippet = snippets[1]
  const secondaryLanguage = secondarySnippet?.language
  const ephemeral = useSnippetStore.use.ephemeral()

  const setPrimaryDocument = (value: string) => {
    useSnippetStore.getState().updateSnippet(PRIMARY_SNIPPET, {
      document: value,
    })
  }

  // Editor State - Extensions
  const fontSize = useEditorStore.use.fontSize()
  const primaryExtensions = useEditorStore.use.primaryExtensions()
  const secondaryExtensions = useEditorStore.use.secondaryExtensions()
  // Editor State
  const { splitPane, setSplitPane } = useEditorStore(state => ({ splitPane: state.splitPane, setSplitPane: state.setSplitPane }))
  const wrapLines = useEditorStore.use.wrapLines()
  const { theme, setTheme } = useEditorStore(state => ({ theme: state.theme, setTheme: state.setTheme }))
  const themeExtension = useEditorStore.use.themeExtension()
  const { desktopView } = useEditorStore(state => ({ desktopView: state.desktopView }))
  const dimensions = useEditorStore.use.dimensions()
  const { menuOpen, setMenuOpen } = useEditorStore(state => ({ menuOpen: state.menuOpen, setMenuOpen: state.setMenuOpen }))
  const { readOnly, setReadOnly } = useEditorStore(state => ({ readOnly: state.readOnly, setReadOnly: state.setReadOnly }))
  const { loading, setLoading } = useEditorStore(state => ({ loading: state.loading, setLoading: state.setLoading }))
  const { editorHeight, setEditorHeight } = useEditorStore(state => ({ editorHeight: state.editorHeight, setEditorHeight: state.setEditorHeight }))
  const { editorWidth, setEditorWidth } = useEditorStore(state => ({ editorWidth: state.editorWidth, setEditorWidth: state.setEditorWidth }))
  const { alert, setAlert } = useEditorStore(state => ({ alert: state.alert, setAlert: state.setAlert }))
  const { dismisser, setDismisser } = useEditorStore(state => ({ dismisser: state.dismisser, setDismisser: state.setDismisser }))

  // handle window dimensions change
  useWindowDimensions()

  useEffect(() => {
    if (alert === "") {
      return
    }
    if (dismisser !== undefined) {
      clearTimeout(dismisser)
    }
    setDismisser(setTimeout(() => {
      setAlert('')
    }, 5000))
  }, [alert]) // adding other dependencies will cause infinite loop

  const getLanguageExtension = (snippet: Snippet) => {
    switch (snippet.language) {
      case 'plaintext':
        break
      default:
        if (snippet.languageExtension) {
          return snippet.languageExtension
        }
    }
  }

  // when sources of extensions change
  // generate a new list of extensions
  // and update the editor
  useEffect(() => {
    let newExtensions: Extension[] = Array<Extension>()
    newExtensions.push(getFontSizeExtension(fontSize))
    if (wrapLines) {
      newExtensions.push(EditorView.lineWrapping)
    }
    let secondaryExtensions = [...newExtensions]

    const primarySnippetLanguageExtension = getLanguageExtension(primarySnippet)
    if (primarySnippetLanguageExtension !== undefined) {
      newExtensions.push(primarySnippetLanguageExtension)
    }

    if (secondarySnippet !== undefined) {
      const secondarySnippetLanguageExtension = getLanguageExtension(secondarySnippet)
      if (secondarySnippetLanguageExtension !== undefined) {
        secondaryExtensions.push(secondarySnippetLanguageExtension)
      }
    }

    useEditorStore.getState().setPrimaryExtensions(newExtensions)
    if (secondarySnippet !== undefined) {
      useEditorStore.getState().setSecondaryExtensions(secondaryExtensions)
    }
  }, [fontSize, primarySnippet, secondarySnippet, wrapLines])

  // if language changes, then update the language extension
  useEffect(() => {
    handleLanguageChange(PRIMARY_SNIPPET)
    handleLanguageChange(SECONDARY_SNIPPET)
  }, [primaryLanguage, secondaryLanguage])

  // handle theme change
  // if theme is invalid or deprecated
  // set the new theme name as selected theme
  useEffect(() => {
    const newTheme = handleThemeChange(theme)
    if (newTheme !== theme) {
      // the theme name was either invalid or theme has been deprecated
      // set the new theme name as selected theme
      setTheme(newTheme)
    }
  }, [theme, setTheme]) // only runs when theme changes

  // load snippet from pastebin
  // if id is present in url
  // and document is empty
  useEffect(() => {
    if (params.id) {
      setReadOnly(true)
      setLoading(true)
      let snippetPromise = undefined
      const restLoader = new RestService(setAlert)
      snippetPromise = restLoader.load(params.id)
      snippetPromise.then(snippet => {
        // Convert back to array
        const snips = snippet.data.split('//<-> ) pastebin1s.com ( <-> \\\\\r\n')
        if (snips.length !== 2) {
          setPrimaryDocument(snippet.data)
          setLoading(false)
          return
        }
        const parsedSnippets: Snippet[] = JSON.parse(snips[1])
        setSnippets(parsedSnippets)
        setLoading(false)
      }).catch(e => {
        switch (e.response.status) {
          case 403:
          case 404:
            setAlert('snippet not found')
            setTimeout(() => {
              onDuplicateAndEdit()
              setLoading(false)
              setPrimaryDocument('')
            }, 5000)
            break;
          default:
            console.log(e)
            setAlert('something went wrong: ' + e)
            setPrimaryDocument('something went wrong: ' + e)
            setTimeout(() => {
              onDuplicateAndEdit()
              setLoading(false)
              setPrimaryDocument('')
            }, 5000)
        }
      })
    } else {
      navigate('/')
    }
  }, []) // only runs on mount

  const onSave = () => {
    // Snippet2 is Snippet without languageExtension
    interface Snippet2 {
      uuid: string,
      name: string,
      language: string,
      document: string
    }
    const validSnippets: Array<Snippet2> = snippets.filter(snippet => snippet.document !== "").map(snippet => {
      return {
        uuid: snippet.uuid,
        name: snippet.name,
        language: snippet.language,
        document: snippet.document
      }
    })
    if (validSnippets.length === 0) {
      setAlert("nothing to save")
      return
    }

    let document: string = "//<-> ) pastebin1s.com ( <-> \\\\\n"
    document += JSON.stringify(validSnippets)

    setReadOnly(true)
    setLoading(true)

    new RestService(setAlert).save({
      data: document,
      metadata: {
        id: "placeholder",
        ephemeral: ephemeral
      }
    }).then(res => {
      navigate('/' + res)
      setAlert("saved")
      setLoading(false)
    }).catch(e => {
      setLoading(false)
      setReadOnly(false)
      console.log(e)
      setAlert('something went wrong: ' + e)
    })
  }

  const onDuplicateAndEdit = () => {
    setReadOnly(false)
    navigate("..")
  }

  // handle window width change
  useEffect(() => {
    if (desktopView) {
      setMenuOpen(false)
    } else {
      setSplitPane(false)
    }
    setEditorHeight(desktopView ? dimensions.height : dimensions.height - 60)
    if (editorContainerRef.current) {
      setEditorWidth(editorContainerRef.current.offsetWidth)
    }
  }, [desktopView, dimensions, setMenuOpen, setEditorHeight, setEditorWidth, setSplitPane])

  useEffect(() => {
    if (secondarySnippet === undefined) {
      setSplitPane(false)
    }
  }, [secondarySnippet, setSplitPane])

  return (
    <div>
      {!desktopView && <NavBar />}
      <div className="flex">
        <div className="flex lg:w-3/4 xl:w-4/5 2xl:w-5/6" ref={editorContainerRef} >
          {!menuOpen && <div className={splitPane ? "w-1/2" : "w-screen"} >
            <CodeMirror
              autoFocus={true}
              value={primarySnippet.document}
              readOnly={readOnly || loading}
              theme={themeExtension}
              extensions={primaryExtensions}
              height={editorHeight.toString() + 'px'}
              width={(splitPane ? (editorWidth / 2).toString() : editorWidth.toString()) + 'px'}
              onChange={(value) => {
                useSnippetStore.getState().updateSnippet(PRIMARY_SNIPPET, {
                  document: value,
                })
              }}
            />
          </div>}
          {!menuOpen && snippets.length >= 2 && splitPane &&
            <div className="w-1/2" style={{ order: 2 }}>
              <CodeMirror
                autoFocus={false}
                value={secondarySnippet.document}
                readOnly={readOnly || loading}
                theme={themeExtension}
                extensions={secondaryExtensions}
                height={editorHeight.toString() + 'px'}
                width={(editorWidth / 2).toString() + 'px'}
                onChange={(value) => {
                  useSnippetStore.getState().updateSnippet(SECONDARY_SNIPPET, {
                    document: value,
                  })
                }} />
            </div>}
        </div>
        {(menuOpen || desktopView) && <div className='lg:w-1/4 xl:w-1/5 2xl:w-1/6 w-full'>
          <MenuBar duplicateAndEdit={onDuplicateAndEdit} id={readOnly ? params.id : undefined} save={onSave} />
        </div>}
      </div>
    </div>
  );
}

export default App;
