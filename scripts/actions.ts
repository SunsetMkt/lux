import * as fs from "fs-extra";
import * as path from "path";
import { buildClient } from "./client";
import { downloadThirdParties, ThirdPartyType } from "./thirdParties";
import { copyConfig, copyLuxCore } from "./copy";
import { CLIENT_PATH, CORE_DIR_NAME, THIRD_PARTIES_PATH } from "./constants";
import { buildDashboard } from "./dashboard";

export enum CoreType {
  LuxCore,
  Config,
  Dashboard,
}

export const createCoreDir = async (types: CoreType[]) => {
  try {
    await fs.remove(CORE_DIR_NAME);
    if (types.includes(CoreType.Dashboard))
      await fs.copy(
        path.join(CLIENT_PATH, "dist", "ui"),
        path.join(CORE_DIR_NAME, "web", "dist")
      );

    if (types.includes(CoreType.LuxCore)) {
      await copyLuxCore();
    }
    if (types.includes(CoreType.Config)) {
      await copyConfig();
    }
  } finally {
    await fs.remove(THIRD_PARTIES_PATH);
  }
};

export const startDownload = async (types: ThirdPartyType[], arch: string) => {
  console.log("Downloading third parties...");
  await downloadThirdParties(types, arch);
  console.log("Download third parties done!");
};

export const startClient = async (arch: string, isDev = false) => {
  console.log("Building client...");
  await buildClient(CLIENT_PATH, arch, isDev);
  console.log("Build client done!");
};

export const startDashboard = async () => {
  console.log("Building dashboard...");
  await buildDashboard(CLIENT_PATH);
  console.log("Build dashboard done!");
};
