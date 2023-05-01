import { Extension } from "@codemirror/state";
import { aura } from "@uiw/codemirror-theme-aura";

const handleThemeChange = (theme: string, setSelectedTheme: (arg0: Extension) => void): string => {
    switch (theme) {
        case 'github-dark':
            import('@uiw/codemirror-theme-github')
                .then(theme => {
                    setSelectedTheme(theme.githubDark)
                })
            return 'github-dark'
        case 'bbedit':
            import('@uiw/codemirror-theme-bbedit')
                .then(theme => {
                    setSelectedTheme(theme.bbedit)
                })
            return 'bbedit'
        case 'aura':
            setSelectedTheme(aura)
            return 'aura'
        default:
            setSelectedTheme(aura)
            return 'aura'
    }
}

export default handleThemeChange
