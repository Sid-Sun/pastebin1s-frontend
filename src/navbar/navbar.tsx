import React from "react";
import { useEditorStore } from "../editorStore";

function navbar() {
  const menuOpen = useEditorStore.use.menuOpen();
  const setMenuOpen = useEditorStore.use.setMenuOpen();
  return (
    <React.Fragment>
      <nav className="relative flex w-full flex-wrap items-center justify-between bg-fuchsia-800 py-4 text-white">
        <div className="container-fluid flex w-full flex-wrap items-center justify-between px-6">
          <div className="container-fluid">
            <a className="block text-center font-mono text-xl" href="/">
              PASTEBIN(1s)
            </a>
          </div>
          <a
            onClick={() => setMenuOpen(!menuOpen)}
            className="block text-center font-mono text-xl"
          >
            {menuOpen ? "editor" : "menu"}
          </a>
        </div>
      </nav>
    </React.Fragment>
  );
}

export default navbar;
