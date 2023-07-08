import React from 'react';
import { Extension } from "@codemirror/state";
import CodeMirror from '@uiw/react-codemirror';
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

import { useSnippetStore } from './snippetStore';
import { useEditorStore } from './editorStore';

function App() {
  const navigate = useNavigate()
  let params = useParams();
  const editorContainerRef = useRef<HTMLDivElement>(null)

  // Store State
  const language = useSnippetStore.use.language()
  const languageExtension = useSnippetStore.use.languageExtension()
  const { document, setDocument } = useSnippetStore(state => ({ document: state.document, setDocument: state.setDocument }))
  const ephemeral = useSnippetStore.use.ephemeral()

  // Editor State
  const fontSize = useEditorStore.use.fontSize()
  const extensions = useEditorStore.use.extensions()
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

  // when sources of extensions change
  // generate a new list of extensions
  // and update the editor
  useEffect(() => {
    let newExtensions: Extension[] = Array<Extension>(getFontSizeExtension(fontSize))
    if (wrapLines) {
      newExtensions.push(EditorView.lineWrapping)
    }
    switch (language) {
      case 'plaintext':
        break
      default:
        if (languageExtension) {
          newExtensions.push(languageExtension)
        }
    }
    useEditorStore.setState({ extensions: newExtensions })
  }, [fontSize, language, languageExtension, wrapLines])

  // if language changes, then update the language extension
  useEffect(() => {
    handleLanguageChange(language)
  }, [language])

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
    if (params.id && document === "") {
      setReadOnly(true)
      setLoading(true)
      let snippetPromise = undefined
      const restLoader = new RestService(setAlert)
      snippetPromise = restLoader.load(params.id)
      snippetPromise.then(snippet => {
        setDocument(snippet.data)
        // Do not set these as we get dummy data from service
        // (pastebin does not expose metadata info via API)
        // setEphemeral(snippet.metadata.ephemeral)
        // setLanguage(snippet.metadata.language)
        setLoading(false)
      }).catch(e => {
        switch (e.response.status) {
          case 403:
          case 404:
            setAlert('snippet not found')
            setDocument('snippet not found')
            setTimeout(() => {
              onDuplicateAndEdit()
              setLoading(false)
              setDocument('')
            }, 5000)
            break;
          default:
            console.log(e)
            setAlert('something went wrong: ' + e)
            setDocument('something went wrong: ' + e)
            setTimeout(() => {
              onDuplicateAndEdit()
              setLoading(false)
              setDocument('')
            }, 5000)
        }
      })
    } else {
      navigate('/')
    }
  }, []) // only runs on mount

  const onSave = () => {
    if (document === "" || document === "cannot save empty snippet!") {
      setAlert("cannot save empty snippet!")
      return
    }

    setLoading(true)

    new RestService(setAlert).save({
      data: document,
      metadata: {
        id: "placeholder",
        language: language,
        ephemeral: ephemeral
      }
    }).then(res => {
      navigate('/' + res)
      setAlert("saved")
      setReadOnly(true)
      setLoading(false)
    }).catch(e => {
      setLoading(false)
      console.log(e)
      setAlert('something went wrong: ' + e)
    })
  }

  const onDuplicateAndEdit = () => {
    setReadOnly(false)
    navigate("..")
  }

  // update document state callback
  const updateDoc = React.useCallback((value: string) => {
    setDocument(value)
  }, [setDocument]);

  // handle window dimensions change
  useWindowDimensions()

  // handle window width change
  useEffect(() => {
    if (desktopView) {
      setMenuOpen(false)
    }
    setEditorHeight(desktopView ? dimensions.height : dimensions.height - 60)
    if (editorContainerRef.current) {
      setEditorWidth(editorContainerRef.current.offsetWidth)
    }
  }, [desktopView, dimensions, setMenuOpen, setEditorHeight, setEditorWidth])

  return (
    <div>
      {!desktopView && <NavBar />}
      <div className="flex">
        {!menuOpen && <div className="lg:w-3/4 xl:w-4/5 2xl:w-5/6 w-screen" ref={editorContainerRef} >
          <CodeMirror
            autoFocus={true}
            value={document}
            readOnly={readOnly || loading}
            theme={themeExtension}
            extensions={extensions}
            height={editorHeight.toString() + 'px'}
            width={editorWidth.toString() + 'px'}
            onChange={updateDoc}
          />
        </div>}
        {(menuOpen || desktopView) && <div className='lg:w-1/4 xl:w-1/5 2xl:w-1/6 w-full'>
          <MenuBar duplicateAndEdit={onDuplicateAndEdit} id={readOnly ? params.id : undefined} save={onSave} />
        </div>}
      </div>
    </div>
  );
}

export default App;
