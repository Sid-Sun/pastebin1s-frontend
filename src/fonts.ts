import { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

const getFontSizeExtension = (fontSize: number) => {
  const FontSizeTheme: Extension = EditorView.theme({
    "&": {
      fontSize: fontSize + "pt",
    },
  });
  return FontSizeTheme;
};

export default getFontSizeExtension;
