import axios from "axios";
import { environment } from "../environment";
import { SnippetModel } from "../model";
import { useEditorStore } from "../editorStore";

export class RestService {
  setAlert: (message: string) => void;

  save(snippet: SnippetModel) {
    const setAlert = this.setAlert;
    return new Promise<string>(async (resolve, reject) => {
      setAlert("saving snippet");
      let bodyFormData = new FormData();
      bodyFormData.append("api_paste_private", "1");
      bodyFormData.append("api_paste_code", snippet.data);
      bodyFormData.append("api_option", "paste");
      bodyFormData.append(
        "api_paste_expire_date",
        snippet.metadata.ephemeral ? "1M" : "N",
      );
      const devKey = useEditorStore.getState().devKey;
      if (devKey !== undefined) {
        if (devKey !== "") {
          bodyFormData.append("api_dev_key", devKey);
        }
      }
      axios
        .post(environment.APIBaseURL + "create", bodyFormData)
        .then((res) => {
          let data = {
            URL: res.data,
          };
          const urlParts = data.URL.split("/");
          const id = urlParts[urlParts.length - 1];
          setAlert("saved");
          resolve(id);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  load(id: string) {
    const setAlert = this.setAlert;
    return new Promise<SnippetModel>(async (resolve, reject) => {
      setAlert("downloading snippet");
      axios
        .get(environment.APIBaseURL + "get/" + id)
        .then((res) => {
          if (typeof res.data !== "string") {
            res.data = JSON.stringify(res.data);
          }
          const data: SnippetModel = {
            data: res.data,
            metadata: {
              // dummy metadata as pastebin does not expose metadata info through API
              id: id,
              ephemeral: true,
            },
          };
          setAlert("downloaded");
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  constructor(setAlert: (message: string) => void) {
    this.setAlert = setAlert;
  }
}
