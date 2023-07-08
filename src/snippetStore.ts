import { create } from 'zustand'
import { Extension } from "@codemirror/state";
import { StoreApi, UseBoundStore } from 'zustand'

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

interface SnippetStore {
  ephemeral: boolean,
  language: string,
  document: string,
  languageExtension: Extension | undefined
}

interface SnippetStoreActions {
  setLanguage: (language: string) => void,
  setDocument: (document: string) => void,
  setEphemeral: (ephemeral: boolean) => void,
  setLanguageExtension: (languageExtension: Extension | undefined) => void
}

const useSnippetStoreBase = create<SnippetStore & SnippetStoreActions>((set) => ({
  ephemeral: true,
  setEphemeral: (ephemeral: boolean) => set({ ephemeral }),
  language: 'markdown',
  setLanguage: (language: string) => set({ language }),
  document: '',
  setDocument: (document: string) => set({ document }),
  languageExtension: undefined,
  setLanguageExtension: (languageExtension: Extension | undefined) => set({ languageExtension })
}))

export const useSnippetStore = createSelectors(useSnippetStoreBase)
