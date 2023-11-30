interface LanguageExtensions {
  [key: string]: string;
}

const langExtensions: LanguageExtensions = {
  cpp: "cpp",
  plaintext: "txt",
  dockerfile: "dockerfile",
  go: "go",
  html: "html",
  java: "java",
  javascript: "js",
  jinja2: "j2",
  json: "json",
  markdown: "md",
  python: "py",
  rust: "rs",
  swift: "swift",
  toml: "toml",
  xml: "xml",
  yaml: "yaml",
};

export default langExtensions;
