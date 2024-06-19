#!/usr/bin/env node

import SetupCLI from "./menu/setup";
import ViewProjects from "./menu/projects";
import inquirer from "inquirer";
import "dotenv/config";

type MainAnswers = {
  selectedMenu: "setup" | "projects" | "exit";
};

async function GetMainAnswers(): Promise<MainAnswers> {
  return (await inquirer.prompt([
    {
      type: "list",
      name: "selectedMenu",
      message: "Select a menu option",
      choices: ["setup", "projects", "exit"],
    },
  ])) as MainAnswers;
}

/**
 * 1. Setup CLI (Auto setup if env vars are missing)
 * 2. Databases
 *    a. Add Project
 *    b. Project 1
 *       i.    Pause/Start
 *       ii.   Delete
 *       iii.  main (active db)
 *          1. Set connection url to env
 *          2. Generate sample data
 *       iv. test-branch (no db)
 *          1. Push database
 *    ...
 *    c. Project 3
 */
async function main() {
  if (!(process.env.DEVDB_TOKEN && process.env.DEVDB_URL)) {
    await SetupCLI();
  } else {
    const { selectedMenu } = await GetMainAnswers();
    switch (selectedMenu) {
      case "setup":
        await SetupCLI();
        break;
      case "projects":
        await ViewProjects();
        break;
      default:
        process.exit(0);
    }
  }

  await main();
}

await main();
