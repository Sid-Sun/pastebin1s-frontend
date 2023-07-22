import React from 'react';
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
  const primarySnippet = useSnippetStore.use.snippets()[0]
  const primaryLanguage = primarySnippet.language
  const secondarySnippet = useSnippetStore.use.snippets()[1]
  const secondaryLanguage = secondarySnippet !== undefined ? secondarySnippet.language : undefined
  const ephemeral = useSnippetStore.use.ephemeral()

  // Editor State - Extensions
  const fontSize = useEditorStore.use.fontSize()
  const primaryExtensions = useEditorStore.use.primaryExtensions()
  const secondaryExtensions = useEditorStore.use.secondaryExtensions()
  // Editor State
  const splitPane = useEditorStore.use.splitPane()
  const wrapLines = useEditorStore.use.wrapLines()
  const { theme, setTheme } = useEditorStore(state => ({ theme: state.theme, setTheme: state.setTheme }))
  const themeExtension = useEditorStore.use.themeExtension()
  const { desktopView } = useEditorStore(state => ({ desktopView: state.desktopView, setDesktopView: state.setDesktopView }))
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

  // // load snippet from pastebin
  // // if id is present in url
  // // and document is empty
  // useEffect(() => {
  //   if (params.id && document === "") {
  //     setReadOnly(true)
  //     setLoading(true)
  //     let snippetPromise = undefined
  //     const restLoader = new RestService(setAlert)
  //     snippetPromise = restLoader.load(params.id)
  //     snippetPromise.then(snippet => {
  //       setDocument(snippet.data)
  //       // Do not set these as we get dummy data from service
  //       // (pastebin does not expose metadata info via API)
  //       // setEphemeral(snippet.metadata.ephemeral)
  //       // setLanguage(snippet.metadata.language)
  //       setLoading(false)
  //     }).catch(e => {
  //       switch (e.response.status) {
  //         case 403:
  //         case 404:
  //           setAlert('snippet not found')
  //           setDocument('snippet not found')
  //           setTimeout(() => {
  //             onDuplicateAndEdit()
  //             setLoading(false)
  //             setDocument('')
  //           }, 5000)
  //           break;
  //         default:
  //           console.log(e)
  //           setAlert('something went wrong: ' + e)
  //           setDocument('something went wrong: ' + e)
  //           setTimeout(() => {
  //             onDuplicateAndEdit()
  //             setLoading(false)
  //             setDocument('')
  //           }, 5000)
  //       }
  //     })
  //   } else {
  //     navigate('/')
  //   }
  // }, []) // only runs on mount

  // const onSave = () => {
  //   if (document === "" || document === "cannot save empty snippet!") {
  //     setAlert("cannot save empty snippet!")
  //     return
  //   }

  //   setLoading(true)

  //   new RestService(setAlert).save({
  //     data: document,
  //     metadata: {
  //       id: "placeholder",
  //       language: language,
  //       ephemeral: ephemeral
  //     }
  //   }).then(res => {
  //     navigate('/' + res)
  //     setAlert("saved")
  //     setReadOnly(true)
  //     setLoading(false)
  //   }).catch(e => {
  //     setLoading(false)
  //     console.log(e)
  //     setAlert('something went wrong: ' + e)
  //   })
  // }

  const onDuplicateAndEdit = () => {
    setReadOnly(false)
    navigate("..")
  }

  // handle window width change
  useEffect(() => {
    console.log("window width changed")
    if (desktopView) {
      setMenuOpen(false)
    }
    // if (menubarContainerRef.current) {
    //   console.log("setting menubar height")
    //   setEditorHeight(desktopView ? menubarContainerRef.current.offsetHeight : dimensions.height - 60)
    // } else {
    setEditorHeight(desktopView ? dimensions.height : dimensions.height - 60)
    // }
    if (editorContainerRef.current) {
      setEditorWidth(editorContainerRef.current.offsetWidth)
    }
  }, [desktopView, dimensions, setMenuOpen, setEditorHeight, setEditorWidth])

  return (
    <div>
      {!desktopView && <NavBar />}
      <div className="flex">
        {!menuOpen && !splitPane && <div className="lg:w-3/4 xl:w-4/5 2xl:w-5/6 w-screen" ref={editorContainerRef} >
          <CodeMirror
            autoFocus={true}
            value={primarySnippet.document}
            readOnly={readOnly || loading}
            theme={themeExtension}
            extensions={primaryExtensions}
            // TODO: set editor height based on menubar height (except for mobile - cuz menubar is not visible on mobile)
            // menubar is always either screen height or more
            height={editorHeight.toString() + 'px'}
            width={editorWidth.toString() + 'px'}
            onChange={(value) => {
              useSnippetStore.getState().updateSnippet(PRIMARY_SNIPPET, {
                document: value,
              })
            }}
          />
        </div>}
        {!menuOpen && splitPane && <div className="flex lg:w-3/4 xl:w-4/5 2xl:w-5/6">
          <div className="w-screen" style={{ order: 1 }} ref={editorContainerRef} >
            <CodeMirror
              autoFocus={true}
              value={"yellow"}
              readOnly={readOnly || loading}
              theme={themeExtension}
              extensions={primaryExtensions}
              height={editorHeight.toString() + 'px'}
              width={(editorWidth).toString() + 'px'}
              onChange={(value) => {
                useSnippetStore.getState().updateSnippet(PRIMARY_SNIPPET, {
                  document: value,
                })
              }} />
          </div>
          <div className="w-screen" style={{ order: 2 }} ref={editorContainerRef} >
            <CodeMirror
              autoFocus={false}
              value={secondarySnippet.document}
              readOnly={readOnly || loading}
              theme={themeExtension}
              extensions={secondaryExtensions}
              height={editorHeight.toString() + 'px'}
              width={(editorWidth).toString() + 'px'}
              onChange={(value) => {
                useSnippetStore.getState().updateSnippet(SECONDARY_SNIPPET, {
                  document: value,
                })
              }} />
          </div>
        </div>}
        {(menuOpen || desktopView) && <div className='lg:w-1/4 xl:w-1/5 2xl:w-1/6 w-full'>
          <MenuBar duplicateAndEdit={onDuplicateAndEdit} id={readOnly ? params.id : undefined} save={() => { }} />
        </div>}
      </div>
    </div>
  );
}

export default App;
