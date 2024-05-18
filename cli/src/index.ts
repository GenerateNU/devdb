#!/usr/bin/env node

import inquirer from "inquirer";
import parse, { type Config } from "parse-git-config";
import type { CLIAnswers } from "./types";
import execa from "execa";
import { getUserPkgRunner } from "./utils/getPackageManager";

//this is where the cli code is generated to ensure we are able to get the user info
async function main() {
  const config: Config = parse.expandKeys(parse.sync());

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const repoURL = config.remote.origin.url;

  const answers: CLIAnswers = (await inquirer.prompt([
    {
      type: "list",
      name: "backendLanguage",
      message: "What backend language are you using?",
      choices: ["TypeScript", "Python", "Go"],
    },
    {
      type: "list",
      name: "dbProvider",
      message: "What database provider are you using?",
      choices: ["sqlite", "mysql", "postgresql"],
    },
    {
      type: "confirm",
      name: "deployDatabase",
      message: "Do you want to deploy a database to the cloud?",
    },
    {
      type: "input",
      name: "token",
      message: "Enter your Generate session token:",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      when: (answers) => answers.deployDatabase === true,
    },
    {
      type: "confirm",
      name: "correctRepo",
      message: `Is ${repoURL} your correct repo?`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      when: (answers) => answers.deployDatabase === true,
    },
  ])) as CLIAnswers;

  const pkgRunner = getUserPkgRunner();
  const { stdout } = await execa(pkgRunner, [
    "prisma",
    "init",
    "--datasource-provider",
    answers.dbProvider,
  ]);

  if (answers.deployDatabase) {
    // Send request to backend to create webhooks
    // Send request to backend to create database
    const connectionURL = "test-url@postgres.db lol"; //TODO: Add later from AWS if deployed there and set DATABASE_URL to this.

    console.log(connectionURL);
  }

  console.log(stdout);
}

//runs it
await main();
