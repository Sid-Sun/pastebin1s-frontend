import { Fragment } from "react";
import { useEditorStore } from "../editorStore";
import EditorOptions from "./EditorOptions/EditorOptions";
import SnippetContainer from "./SnippetContainer/SnippetContainer";
import SnippetOptions from "./SnippetOptions/SnippetOptions";
import { useSnippetStore } from "../snippetStore";

interface menubarProps {
  id?: string;
  save: () => void;
  duplicateAndEdit: () => void;
}

function MenuBar(props: menubarProps) {
  let showBranding = !useEditorStore.use.menuOpen();
  let { ephemeral, setEphemeral } = useSnippetStore((state) => ({
    ephemeral: state.ephemeral,
    setEphemeral: state.setEphemeral,
  }));
  let alert = useEditorStore.use.alert();
  let loading = useEditorStore.use.loading();
  let readOnly = useEditorStore.use.readOnly();
  let desktopView = useEditorStore.use.desktopView();
  let devKey = useEditorStore.use.devKey();

  return (
    <Fragment>
      <div className="max-h-screen min-h-screen overflow-auto bg-gray-800 text-white">
        {showBranding && (
          <div className="bg-fuchsia-800 p-8">
            <a className="block text-center font-mono text-2xl" href="/">
              PASTEBIN(1s) 🏳️‍🌈
            </a>
          </div>
        )}
        <div className="px-4">
          <div>
            <div>
              <h4 className="mt-6 pb-4 font-mono text-xl">Paste Actions</h4>
              <label htmlFor="password" className="mb-4 text-center font-mono">
                Custom API Key (optional):
              </label>
              <input
                onChange={(e) =>
                  useEditorStore.getState().setDevKey(e.target.value)
                }
                value={devKey}
                className="focus:shadow-outline mb-3 mt-1 w-full appearance-none rounded border border-solid border-pink-50 bg-pink-50 bg-clip-padding bg-no-repeat px-3 py-2 text-base leading-tight text-gray-700 shadow focus:text-gray-700 focus:outline-none"
                id="password"
                type="password"
                placeholder="******************"
              />
              <div className="flex justify-center space-x-2">
                {!readOnly && (
                  <button
                    disabled={loading}
                    onClick={props.save}
                    className={
                      "inline-block h-10 w-full bg-pink-600 px-6 py-2.5 active:bg-pink-300 " +
                      (desktopView
                        ? "hover:bg-pink-300 hover:text-black"
                        : "") +
                      " text-md rounded font-mono font-medium leading-tight text-white shadow-lg transition duration-150 ease-in-out"
                    }
                  >
                    <p>Save Snippets</p>
                  </button>
                )}
                {readOnly && (
                  <button
                    disabled={loading}
                    onClick={props.duplicateAndEdit}
                    type="button"
                    className={
                      "inline-block h-10 w-full bg-pink-600 px-6 py-2.5 active:bg-pink-300 " +
                      (desktopView
                        ? "hover:bg-pink-300 hover:text-black"
                        : "") +
                      " text-md rounded font-mono font-medium leading-tight text-white shadow-lg transition duration-150 ease-in-out"
                    }
                  >
                    Duplicate and Edit
                  </button>
                )}
              </div>
              {props.id && (
                <div className="mt-3 flex justify-center space-x-2">
                  <a
                    type="button"
                    href={"https://pastebin.com/raw/" + props.id}
                    className={
                      "mx-auto inline-block h-10 w-full bg-rose-200 px-6 py-2.5 active:bg-rose-600 active:text-white " +
                      (desktopView
                        ? "hover:bg-rose-600 hover:text-white"
                        : "") +
                      " rounded text-center font-mono text-base font-medium leading-tight text-black shadow-lg transition duration-150 ease-in-out hover:shadow-lg active:shadow-lg"
                    }
                  >
                    Go to paste raw URL
                  </a>
                </div>
              )}
              {props.id && (
                <div className="mt-3 flex justify-center space-x-2">
                  <a
                    type="button"
                    href={"https://pastebin.com/" + props.id}
                    className={
                      "mx-auto inline-block h-10 w-full bg-fuchsia-200 px-6 py-2.5 active:bg-fuchsia-600 active:text-white " +
                      (desktopView
                        ? "hover:bg-fuchsia-600 hover:text-white"
                        : "") +
                      " rounded text-center font-mono text-base font-medium leading-tight text-black shadow-lg transition duration-150 ease-in-out hover:shadow-lg active:shadow-lg"
                    }
                  >
                    Go to Pastebin
                  </a>
                </div>
              )}
              {!readOnly && (
                <div className="form-check items-stretch pt-3">
                  <input
                    disabled={readOnly || loading}
                    checked={ephemeral}
                    onChange={() => setEphemeral(!ephemeral)}
                    type="checkbox"
                    id="ephemeral"
                    className="form-check-input accent-pink-600"
                  />
                  <label
                    htmlFor="ephemeral"
                    className="pl-2 text-center font-mono"
                  >
                    Auto-Delete after 1 month
                  </label>
                </div>
              )}
            </div>
            <SnippetOptions />
            <SnippetContainer />
            <EditorOptions />
          </div>
          {alert !== "" && (
            <div className="my-3 flex rounded-md border border-gray-400 bg-gray-300 py-2 text-sm text-gray-900">
              <span>{alert}</span>
            </div>
          )}
          <div>
            <a
              className="text-l mb-3 mt-4 block cursor-pointer text-center font-mono"
              href="https://pastebin1s.com/Ethhhtda"
            >
              About
            </a>
            <a
              className="text-l my-3 block cursor-pointer  text-center font-mono"
              href="https://github.com/sid-sun/pastebin1s-frontend"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            <a
              className="text-l my-3 block cursor-pointer text-center font-mono"
              href="https://pastebin1s.com/0ePz2c2d"
            >
              Privacy Policy
            </a>
          </div>
        </div>
        <div className="mx-1 my-8 text-center font-mono text-sm">
          <p>
            Designed by{" "}
            <a href="https://chakshu.design" rel="noreferrer" target="_blank">
              Chakshu Khanna
            </a>{" "}
            in California.
          </p>
          <p>
            Developed 👩‍💻 by{" "}
            <a href="https://sidsun.com" rel="noreferrer" target="_blank">
              Sid Sun
            </a>{" "}
            🏳️‍🌈
          </p>
          <br />
          <p>Copyright © {new Date().getFullYear()} Sid Sun.</p>
        </div>
      </div>
    </Fragment>
  );
}

export default MenuBar;
