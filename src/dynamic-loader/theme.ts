import { Extension } from "@codemirror/state";
import { duotoneDark } from "@uiw/codemirror-theme-duotone";

const handleThemeChange = (theme: string, setSelectedTheme: (arg0: Extension) => void) => {
    switch (theme) {
        case 'duotone-dark':
            setSelectedTheme(duotoneDark)
            break
        case 'github-dark':
            import('@uiw/codemirror-theme-github')
                .then(theme => {
                    setSelectedTheme(theme.githubDark)
                })
            break
        case 'xcode-dark':
        case 'xcode-light':
            import('@uiw/codemirror-theme-xcode')
                .then(themeExtension => {
                    theme === "xcode-dark" ? setSelectedTheme(themeExtension.xcodeDark) : setSelectedTheme(themeExtension.xcodeLight)
                })
            break
    }
}

export default handleThemeChange