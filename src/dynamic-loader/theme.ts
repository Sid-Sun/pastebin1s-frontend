import { aura } from "@uiw/codemirror-theme-aura";
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
    case "aura":
      setThemeExtension(aura);
      return "aura";
    default:
      setThemeExtension(aura);
      return "aura";
  }
};

export default handleThemeChange;
