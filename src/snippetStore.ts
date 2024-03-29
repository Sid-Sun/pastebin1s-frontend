import { create } from "zustand";
import { Extension } from "@codemirror/state";
import { StoreApi, UseBoundStore } from "zustand";
import diceware from "./diceware";
import { v4 as uuidv4 } from "uuid";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export interface SnippetUpdate {
  name?: string;
  language?: string;
  document?: string;
  languageExtension?: Extension;
}

export interface Snippet {
  uuid: string;
  name: string;
  language: string;
  document: string;
  languageExtension?: Extension;
}

interface SnippetStore {
  ephemeral: boolean;
  snippets: Snippet[];
}

interface SnippetStoreActions {
  createSnippet: () => void;
  removeSnippet: (id: number) => void;
  updateSnippet: (id: number, snippet: SnippetUpdate) => void;
  setSnippets: (snippets: Snippet[]) => void;
  makeSnippetPrimary: (id: number) => void;
  makeSnippetSecondary: (id: number) => void;
  setEphemeral: (ephemeral: boolean) => void;
}

const generateSnippet = (): Snippet => ({
  uuid: uuidv4(),
  name: diceware(),
  language: "plaintext",
  document: "",
  languageExtension: undefined,
});

const useSnippetStoreBase = create<SnippetStore & SnippetStoreActions>(
  (set) => ({
    ephemeral: true,
    setEphemeral: (ephemeral: boolean) => set({ ephemeral }),
    snippets: [generateSnippet()],
    createSnippet: () =>
      set((state) => ({
        snippets: [...state.snippets, generateSnippet()],
      })),
    removeSnippet: (id: number) =>
      set((state) => ({
        snippets:
          state.snippets.length === 1
            ? [generateSnippet()]
            : state.snippets.filter((_, i) => i !== id),
      })),
    updateSnippet: (id: number, update: SnippetUpdate) =>
      set((state) => {
        const newSnippets = [...state.snippets];
        const oldSnippet = state.snippets[id];
        newSnippets[id] = { ...oldSnippet, ...update };
        return { snippets: newSnippets };
      }),
    setSnippets: (snippets: Snippet[]) => set({ snippets }),
    makeSnippetPrimary: (id: number) =>
      set((state) => {
        if (id === 0 || state.snippets.length < 2) {
          return state;
        }
        const newSnippets = [...state.snippets];
        const temp = newSnippets[0];
        newSnippets[0] = newSnippets[id];
        newSnippets[id] = temp;
        return { snippets: newSnippets };
      }),
    makeSnippetSecondary: (id: number) =>
      set((state) => {
        if (id === 1 || state.snippets.length < 2) {
          return state;
        }
        const newSnippets = [...state.snippets];
        const temp = newSnippets[1];
        newSnippets[1] = newSnippets[id];
        newSnippets[id] = temp;
        return { snippets: newSnippets };
      }),
  }),
);

export const useSnippetStore = createSelectors(useSnippetStoreBase);
