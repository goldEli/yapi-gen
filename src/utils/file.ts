import * as path from "path";
import * as fs from "fs";
import { rootPath } from "./vscodeEnv";

export const getFileContent = (filePath: string, fullPath = false) => {
  let fileContent = "";
  const fileFullPath = fullPath ? filePath : path.join(rootPath, filePath);
  try {
    const fileBuffer = fs.readFileSync(fileFullPath);
    fileContent = fileBuffer.toString();
  } catch (error) {}
  return fileContent;
};

export function folderExists(folderPath: string): boolean {
  try {
    return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory();
  } catch (error) {
    console.error(`Error checking if folder exists: ${error}`);
    return false;
  }
}
