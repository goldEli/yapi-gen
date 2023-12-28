import * as vscode from "vscode";
import { genCodeByYapi } from "../genCode/genCodeByYapi";
// import { genCodeByJson } from "../genCode/genCodeByJson";
// import { genCodeByTypescript } from "../genCode/genCodeByTypescript";
import { getClipboardContent, getClipboardText } from "../utils/editor";
// import { jsonIsValid, jsonParse } from "../utils/json";
import { isYapiId, showErrorMessage, showMessage } from "../utils";

const { window } = vscode;

export const generateCode = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("yapi-gen.yapiCode", async () => {
      const clipboardText = await getClipboardContent() ?? '';
      // let clipboardText = rawClipboardText.trim();

      // clipboardText = JSON.stringify(jsonParse(clipboardText));

      console.log(clipboardText);
      const validYapiId = isYapiId(clipboardText);

      // showMessage("123" + validYapiId);

      // const validJson = jsonIsValid(clipboardText);

      // const valid = validYapiId;
      // if (valid) {
      if (validYapiId) {
        console.log('genCodeByYapi', validYapiId)
        await genCodeByYapi(clipboardText, clipboardText);
      } else {
        // await genCodeByJson(clipboardText, rawClipboardText);
      }
      // return;
      // }
      // try {
      //   await genCodeByTypescript(rawClipboardText, rawClipboardText);
      // } catch {
      //   showErrorMessage('请复制Yapi接口ID');
      // }
    })
  );
};
