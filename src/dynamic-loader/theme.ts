import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import { useEditorStore } from "../editorStore";

const setThemeExtension = useEditorStore.getState().setThemeExtension;

const handleThemeChange = (theme: string): string => {
  switch (theme) {
    case "github-dark":
      import("@uiw/codemirror-theme-github").then((theme) => {
        setThemeExtension(theme.githubDark);
      });
      return "github-dark";
    case "bbedit":
      import("@uiw/codemirror-theme-bbedit").then((theme) => {
        setThemeExtension(theme.bbedit);
      });
      return "bbedit";
    case "gruvbox-dark":
      import("@uiw/codemirror-theme-gruvbox-dark").then((theme) => {
        setThemeExtension(theme.gruvboxDark);
      });
      return "gruvbox-dark";
    case "gruvbox-light":
      import("@uiw/codemirror-theme-gruvbox-dark").then((theme) => {
        setThemeExtension(theme.gruvboxLight);
      });
      return "gruvbox-light";
    case "xcode":
      import("@uiw/codemirror-theme-xcode").then((theme) => {
        setThemeExtension(theme.xcodeDark);
      });
      return "xcode";
    default:
      setThemeExtension(noctisLilac);
      return "lilac";
  }
};

export default handleThemeChange;
