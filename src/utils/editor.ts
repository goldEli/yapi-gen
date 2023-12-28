import * as copyPaste from "copy-paste";
import * as vscode from "vscode";

export const getClipboardText = () => copyPaste.paste();

export async function getClipboardContent(): Promise<string | undefined> {
  try {
    const clipboardContent = await vscode.env.clipboard.readText();
    return clipboardContent?.trim();
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error reading clipboard content: ${error}`
    );
    return undefined;
  }
}

export const insertSnippet = (content: string) => {
  const activeTextEditor = vscode.window.activeTextEditor;
  //   if (activeTextEditor === undefined) {
  //     throw new Error("无打开文件");
  //   }
  return activeTextEditor?.insertSnippet(new vscode.SnippetString(content));
};

export const replaceToEditor = (content: string) => {
  const editor = vscode.window.activeTextEditor;
  editor?.edit((builder) => {
    builder.replace(editor.selection, content);
  });
};

export const getSelectedText = () => {
  const { selection, document } = vscode.window.activeTextEditor!;
  return document.getText(selection).trim();
};

export const getFuncNameAndTypeName = () => {
  // 这部分代码可以写在模版里，暂时保留
  const selectedText = getSelectedText() || "";
  let funcName = "fetch";
  let typeName = "IFetchResult";
  if (selectedText) {
    const splitValue = selectedText.split(" ");
    funcName = splitValue[0] || funcName;
    if (splitValue.length > 1 && splitValue[1]) {
      typeName = splitValue[1];
    } else {
      typeName = `I${
        funcName.charAt(0).toUpperCase() + funcName.slice(1)
      }Result`;
    }
  }
  return {
    funcName,
    typeName,
    inputValues: selectedText.split(" "),
    rawSelectedText: selectedText,
  };
};
