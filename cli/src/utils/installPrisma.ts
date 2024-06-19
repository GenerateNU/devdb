import { execa } from "execa";
import { getUserPkgRunner } from "./getPackageManager";
import { type DBProvider } from "../../../src/server/external/types";
export default async function InstallPrisma(dbProvider: DBProvider) {
  try {
    const pkgRunner = getUserPkgRunner();
    await execa(pkgRunner, [
      "prisma",
      "init",
      "--datasource-provider",
      dbProvider,
    ]);
  } catch (error) {
    console.log("Prisma already setup");
  }
}
