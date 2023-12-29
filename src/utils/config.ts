import * as path from "path";
import * as fs from "fs-extra";
import { workspace } from "vscode";
import { getFileContent } from "./file";
import { rootPath } from "./vscodeEnv";
import { showErrorMessage } from ".";

/**
 * 获取模板文件路径，默认为 codeTemplate 目录下
 *
 * @returns
 */
export const getTemplateFilePath = () => "codeTemplate";

export type Config = {
  yapi?: {
    domain?: string;
    projects?: {
      name: string;
      token: string;
      domain: string;
      basePath?: string;
    }[];
  };
  mock?: {
    mockNumber?: string;
    mockBoolean?: string;
    mockString?: string;
    mockKeyWordEqual?: {
      key: string;
      value: string;
    }[];
    mockKeyWordLike?: {
      key: string;
      value: string;
    }[];
  };
  commonlyUsedBlock?: string[];
};

export const configFilePath = path.join(rootPath, "./yapi-gen/config.json");
export const ejsTemplatePath = path.join(rootPath, "./yapi-gen/template.ejs");
export const configDir = path.join(rootPath, "./yapi-gen");

const defaultConfig: Config = {
  yapi: { projects: [] },
  mock: { mockKeyWordEqual: [], mockKeyWordLike: [] },
  commonlyUsedBlock: [],
};

export const getConfig: () => Config = () => {
  let config: Config = {};
  if (fs.existsSync(configFilePath)) {
    config = JSON.parse(getFileContent(configFilePath, true) || "{}");
    config.yapi?.projects?.forEach((s) => {
      s.domain = s.domain || config.yapi?.domain || "";
    });
  } else {
    // config = getAllConfig();
    showErrorMessage("./yapi-gen/config.json不存在");
  }
  return { ...defaultConfig, ...config };
};
