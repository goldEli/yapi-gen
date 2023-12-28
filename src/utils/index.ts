import * as vscode from "vscode";

export const showErrorMessage = (message: string) => {
  vscode.window.showErrorMessage(message);
};

export const showMessage = (message: string) => {
  vscode.window.showInformationMessage(message);
};

export const isYapiId = (value: string) => /^[0-9]{1,}$/g.test(value);