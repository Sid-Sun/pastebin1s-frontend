import { create } from 'zustand'
import { combine } from "zustand/middleware"
import { Extension } from "@codemirror/state";
import { StoreApi, UseBoundStore } from 'zustand'
import { aura } from '@uiw/codemirror-theme-aura';
import { getWindowDimensions } from './dimensions';
import getFontSizeExtension from './fonts';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ; (store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

// @ts-ignore -- needed as TS thinks second localStorage.getItem() call would return null but it won't due to ternary
const getFontSize = (): number => localStorage.getItem('fontsize') === null ? 16 : parseInt(localStorage.getItem('fontsize'))

const getDefaultValues = (): EditorStore => ({
  editorWidth: 0,
  editorHeight: 0,
  readOnly: false,
  loading: false,
  alert: '',
  dismisser: undefined,
  desktopView: getWindowDimensions().width >= 1024,
  menuOpen: false,
  splitPane: true,
  dimensions: getWindowDimensions(),
  wrapLines: localStorage.getItem('wrapline') === "no" ? false : true,
  fontSize: getFontSize(),
  // @ts-ignore -- needed as TS thinks second localStorage.getItem() call would return null but it won't due to ternary
  theme: (localStorage.getItem('theme') === null ? "aura" : localStorage.getItem('theme')),
  themeExtension: aura,
  primaryExtensions: [getFontSizeExtension(getFontSize())],
  secondaryExtensions: [getFontSizeExtension(getFontSize())],
})

interface EditorStore {
  dimensions: { width: number, height: number },
  dismisser: NodeJS.Timeout | undefined,
  editorWidth: number,
  editorHeight: number,
  readOnly: boolean,
  splitPane: boolean,
  loading: boolean,
  alert: string | undefined,
  desktopView: boolean,
  wrapLines: boolean,
  fontSize: number,
  theme: string,
  themeExtension: Extension,
  menuOpen: boolean,
  primaryExtensions: Extension[]
  secondaryExtensions: Extension[]
}

interface EditorStoreActions {
  setDismisser: (dismisser: NodeJS.Timeout | undefined) => void,
  setDimensions: (dimensions: { width: number, height: number }) => void,
  setEditorWidth: (editorWidth: number) => void,
  setEditorHeight: (editorHeight: number) => void,
  setReadOnly: (readonly: boolean) => void,
  setSplitPane: (splitPane: boolean) => void,
  setLoading: (loading: boolean) => void,
  setAlert: (alert: string | undefined) => void,
  setDesktopView: (desktopView: boolean) => void,
  setWrapLines: (wrapLines: boolean) => void,
  setFontSize: (fontSize: number) => void,
  setTheme: (theme: string) => void,
  setThemeExtension: (themeExtension: Extension) => void,
  setMenuOpen: (menuOpen: boolean) => void,
  setPrimaryExtensions: (extensions: Extension[]) => void,
  setSecondaryExtensions: (extensions: Extension[]) => void
}

const useEditorStoreBase = create<EditorStore & EditorStoreActions>(combine(getDefaultValues(), (set) => ({
  setDismisser: (dismisser: NodeJS.Timeout | undefined) => set({ dismisser }),
  setDimensions: (dimensions: { width: number, height: number }) => set({ dimensions }),
  setEditorWidth: (editorWidth: number) => set({ editorWidth }),
  setEditorHeight: (editorHeight: number) => set({ editorHeight }),
  setSplitPane: (splitPane: boolean) => set({ splitPane }),
  setReadOnly: (readOnly: boolean) => set({ readOnly }),
  setLoading: (loading: boolean) => set({ loading }),
  setAlert: (alert: string | undefined) => set({ alert }),
  setDesktopView: (desktopView: boolean) => set({ desktopView }),
  setWrapLines: (wrapLines: boolean) => {
    set({ wrapLines })
    localStorage.setItem('wrapline', wrapLines ? "yes" : "no")
  },
  setFontSize: (fontSize: number) => {
    set({ fontSize })
    localStorage.setItem('fontsize', fontSize.toString())
  },
  setTheme: (theme: string) => {
    set({ theme })
    localStorage.setItem('theme', theme)
  },
  setThemeExtension: (themeExtension: Extension) => set({ themeExtension }),
  setMenuOpen: (menuOpen: boolean) => set({ menuOpen }),
  setPrimaryExtensions: (primaryExtensions: Extension[]) => set({ primaryExtensions }),
  setSecondaryExtensions: (secondaryExtensions: Extension[]) => set({ secondaryExtensions })
})))

export const useEditorStore = createSelectors(useEditorStoreBase)
