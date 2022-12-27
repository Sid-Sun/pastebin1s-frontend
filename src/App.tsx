import React from 'react';
import { Extension } from "@codemirror/state";
import CodeMirror from '@uiw/react-codemirror';
import { useEffect, useRef, useState } from 'react';
import { EditorView } from "@codemirror/view";
import { useNavigate, useParams } from "react-router-dom";
import { duotoneDark } from '@uiw/codemirror-theme-duotone';

import './App.css';

import MenuBar from './menubar'
import NavBar from './navbar/navbar'

import getFontSizeThemeExtension from './fonts'
import useWindowDimensions from './dimensions';
import { handleLanguageChange, handleThemeChange } from './dynamic-loader';
import { RestService } from './service/rest';

function App() {
  const navigate = useNavigate()
  let params = useParams();
  let [editorWidth, setEditorWidth] = useState<number>(0)
  let [editorHeight, setEditorHeight] = useState<number>(0)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  let [readOnly, setReadOnly] = useState<boolean>(false)
  let [loading, setLoading] = useState<boolean>(false)
  let [alert, setAlert] = useState<string>('')
  let [dismisser, setDismisser] = useState<NodeJS.Timeout | undefined>()
  let [desktopView, setDesktopView] = useState<boolean>(false)
  // Editor State Properties 
  let [wrapLine, setWrapLine] = useState<boolean>(localStorage.getItem('wrapline') === "no" ? false : true)
  // @ts-ignore -- needed as TS thinks second localStorage.getItem() call would return null but it won't due to ternary
  let [fontSize, setFontSize] = useState<number>(localStorage.getItem('fontsize') === null ? 16 : parseInt(localStorage.getItem('fontsize')))
  // @ts-ignore -- needed as TS thinks second localStorage.getItem() call would return null but it won't due to ternary 
  let [theme, setTheme] = useState<string>(localStorage.getItem('theme') === null ? "duotone-dark" : localStorage.getItem('theme')) // stores name of theme
  let [selectedTheme, setSelectedTheme] = useState<Extension>(duotoneDark) // stores theme extenstion
  // Snippet State Properties
  let [ephemeral, setEphemeral] = useState<boolean>(true)
  let [language, setLanguage] = useState<string>("markdown")
  let [document, setDocument] = useState<string>("")
  let [selectedLanguage, setSelectedLanguage] = useState<Extension | undefined>()
  // Menubar (Mobile) State
  let [menubarVisible, setMenubarVisible] = useState<boolean>(false)

  useEffect(() => {
    localStorage.setItem('theme', theme)
    localStorage.setItem('fontsize', fontSize.toString())
    localStorage.setItem('wrapline', wrapLine ? "yes" : "no")
  }, [wrapLine, fontSize, theme])

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
  }, [alert])

  const getExtensions = () => {
    let extensions: Extension[] = [getFontSizeThemeExtension(fontSize)]
    if (wrapLine) {
      extensions.push(EditorView.lineWrapping)
    }
    switch (language) {
      case 'plaintext':
        break
      default:
        if (selectedLanguage) {
          extensions.push(selectedLanguage)
        }
    }
    return extensions
  }

  useEffect(() => {
    handleLanguageChange(language, setSelectedLanguage)
  }, [language]) // runs only on language change

  useEffect(() => {
    handleThemeChange(theme, setSelectedTheme)
  }, [theme]) // only runs when theme changes

  // load snippet if param 'id' is present
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
  }, [])

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

  // hook to enable window free-sizeing
  let dimensions = useWindowDimensions()

  // handle window width change
  useEffect(() => {
    setDesktopView(dimensions.width >= 1024)
  }, [dimensions])

  // handle window width change
  useEffect(() => {
    if (desktopView) {
      setMenubarVisible(false)
    }
    setEditorHeight(desktopView ? dimensions.height : dimensions.height - 60)
    if (editorContainerRef.current) {
      setEditorWidth(editorContainerRef.current.offsetWidth)
    }
  }, [desktopView, dimensions])

  const updateDoc = React.useCallback((value: string) => {
    setDocument(value)
  }, []);

  return (
    <div>
      {!desktopView && <NavBar menubar={menubarVisible} setMenubarDisplay={setMenubarVisible} />}
      <div className="flex">
        {!menubarVisible && <div className="lg:w-3/4 xl:w-4/5 2xl:w-5/6 w-screen" ref={editorContainerRef} >
          <CodeMirror
            autoFocus={true}
            value={document}
            readOnly={readOnly || loading}
            theme={selectedTheme}
            extensions={getExtensions()}
            height={editorHeight.toString() + 'px'}
            width={(editorWidth).toString() + 'px'}
            onChange={updateDoc}
          />
        </div>}
        {(menubarVisible || desktopView) && <div className='lg:w-1/4 xl:w-1/5 2xl:w-1/6 w-full'>
          <MenuBar showBranding={!menubarVisible} duplicateAndEdit={onDuplicateAndEdit} id={readOnly ? params.id : undefined} alert={alert} loading={loading} readOnly={readOnly} save={onSave} language={{ language, setLanguage }} theme={{ theme, setTheme }} font={{ fontSize, setFontSize }} wrapLine={{ wrapLine, setWrapLine }}
            ephemeral={{
              ephemeral, setEphemeral
            }} />
        </div>}
      </div>
    </div>
  );
}

export default App;
