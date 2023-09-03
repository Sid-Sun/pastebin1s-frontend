import React from 'react'
import { useEditorStore } from '../editorStore'

function navbar() {
  const menuOpen = useEditorStore.use.menuOpen()
  const setMenuOpen = useEditorStore.use.setMenuOpen()
  return (
    <React.Fragment>
      <nav className="relative w-full flex flex-wrap items-center justify-between py-4 bg-fuchsia-800 text-white">
        <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
          <div className="container-fluid">
            <a className="font-mono text-center text-xl block" href="/">PASTEBIN(1s)</a>
          </div>
          <a onClick={() => setMenuOpen(!menuOpen)} className="font-mono text-center text-xl block">{menuOpen ? 'editor' : 'menu'}</a>
        </div>
      </nav>
    </React.Fragment>
  )
}

export default navbar
