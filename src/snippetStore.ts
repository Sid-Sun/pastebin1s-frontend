import { create } from 'zustand'
import { Extension } from "@codemirror/state";
import { StoreApi, UseBoundStore } from 'zustand'
import diceware from './diceware'

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

export interface SnippetUpdate {
  name?: string,
  language?: string,
  document?: string,
  languageExtension?: Extension,
}

export interface Snippet {
  name: string,
  language: string,
  document: string,
  languageExtension: Extension | undefined,
}

interface SnippetStore {
  ephemeral: boolean,
  snippets: Snippet[],
}

interface SnippetStoreActions {
  createSnippet: () => void,
  removeSnippet: (id: number) => void,
  updateSnippet: (id: number, snippet: SnippetUpdate) => void,
  makeSnippetPrimary: (id: number) => void,
  makeSnippetSecondary: (id: number) => void,
  setEphemeral: (ephemeral: boolean) => void,
}

const useSnippetStoreBase = create<SnippetStore & SnippetStoreActions>((set) => ({
  ephemeral: true,
  setEphemeral: (ephemeral: boolean) => set({ ephemeral }),
  snippets: [
    {
      name: diceware(),
      language: 'markdown',
      document: '',
      languageExtension: undefined
    },
    {
      name: diceware(),
      language: 'markdown',
      document: '',
      languageExtension: undefined
    }
  ],
  createSnippet: () => set((state) => ({
    snippets: [...state.snippets, {
      name: diceware(),
      language: 'markdown',
      document: '',
      languageExtension: undefined
    }]
  })),
  removeSnippet: (id: number) => set((state) => ({
    snippets: state.snippets.length === 1 ? [{
      name: diceware(),
      language: 'markdown',
      document: '',
      languageExtension: undefined
    }] : state.snippets.filter((_, i) => i !== id)
  })),
  updateSnippet: (id: number, update: SnippetUpdate) => set((state) => {
    const newSnippets = [...state.snippets]
    const oldSnippet = state.snippets[id]
    newSnippets[id] = { ...oldSnippet, ...update }
    return { snippets: newSnippets }
  }),
  makeSnippetPrimary: (id: number) => set((state) => {
    if (id === 0 || state.snippets.length < 2) {
      return state
    }
    const newSnippets = [...state.snippets]
    const temp = newSnippets[0]
    newSnippets[0] = newSnippets[id]
    newSnippets[id] = temp
    return { snippets: newSnippets }
  }),
  makeSnippetSecondary: (id: number) => set((state) => {
    if (id === 1 || state.snippets.length < 2) {
      return state
    }
    const newSnippets = [...state.snippets]
    const temp = newSnippets[1]
    newSnippets[1] = newSnippets[id]
    newSnippets[id] = temp
    return { snippets: newSnippets }
  }),
}))

export const useSnippetStore = createSelectors(useSnippetStoreBase)
