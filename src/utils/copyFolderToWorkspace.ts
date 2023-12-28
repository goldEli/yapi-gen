import * as vscode from "vscode";
import * as path from "path";
import * as fsExtra from "fs-extra";
import { folderExists } from "./file";

export async function copyFolderToWorkspace(
  sourceFolder: string,
  targetFolder: string
): Promise<void> {
  if (folderExists(targetFolder)) {
    return Promise.resolve();
  }
  try {
    // let wf = vscode?.workspace?.workspaceFolders?.[0].uri.path;
    // let f = vscode?.workspace?.workspaceFolders?.[0].uri.fsPath;

    // 获取插件的绝对路径
    const extensionPath =
      vscode.extensions.getExtension("miaoyu.yapi-gen")?.extensionPath;

    if (extensionPath) {
      // 构造源文件夹的完整路径
      const sourceFolderPath = path.join(extensionPath, sourceFolder);

      vscode.window.showInformationMessage(
        "sourceFolderPath",
        sourceFolderPath
      );
      vscode.window.showInformationMessage("targetFolder", targetFolder);
      // 使用 fs-extra 的 copy 方法，设置 overwrite 选项为 true，确保覆盖目标文件夹
      await fsExtra.copy(sourceFolderPath, targetFolder, { overwrite: true });

      vscode.window.showInformationMessage(
        `Folder copied successfully to ${targetFolder}`
      );
    } else {
      vscode.window.showErrorMessage("Failed to get extension path");
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Error copying folder: ${error}`);
  }
}
