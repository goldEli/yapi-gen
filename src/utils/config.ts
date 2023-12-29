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

const defaultConfig: Config = {
  yapi: { projects: [] },
  mock: { mockKeyWordEqual: [], mockKeyWordLike: [] },
  commonlyUsedBlock: [],
};

export const getConfig: () => Config = () => {
  let config: Config = {};
  if (fs.existsSync(path.join(rootPath, ".lowcoderc"))) {
    config = JSON.parse(getFileContent(".lowcoderc") || "{}");
    config.yapi?.projects?.forEach((s) => {
      s.domain = s.domain || config.yapi?.domain || "";
    });
  } else {
    // config = getAllConfig();
    showErrorMessage(".lowcoderc不存在");
  }
  return { ...defaultConfig, ...config };
};
