#!/usr/bin/env node

import inquirer from "inquirer";
import parse, { type Config } from "parse-git-config";
import type { CLIAnswers, EndpointResponse } from "./types";
import { execa } from "execa";
import { getUserPkgRunner } from "./utils/getPackageManager";
import parseGithubUrl from "parse-github-url";
import axios from "axios";

const baseUrl = "https://routes-orcin.vercel.app/";
const apiPath = "api/trpc/";
const webhookPath = "github.makeWebhook";
const createDatabasePath = "database.create";
const endpointPath = "database.endpoint";

//this is where the cli code is generated to ensure we are able to get the user info
async function main() {
  const config: Config = parse.expandKeys(parse.sync());

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const repoUrl = config?.remote?.origin?.url;

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
      choices: ["mysql", "postgres"],
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
      message: `Is ${repoUrl} your correct repo?`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      when: (answers) => answers.deployDatabase === true,
    },
  ])) as CLIAnswers;

  try {
    const pkgRunner = getUserPkgRunner();
    const { stdout } = await execa(pkgRunner, [
      "prisma",
      "init",
      "--datasource-provider",
      answers.dbProvider,
    ]);
  } catch (error) {
    console.log("Prisma already setup");
  }

  if (answers.deployDatabase) {
    const parsedUrl = parseGithubUrl(repoUrl as string);
    console.log("Name:", parsedUrl?.name ?? ""); // repositoryName

    if (!repoUrl) {
      console.error("No repo found in git config");
      process.exit(1);
    }

    console.log("Creating webhooks...");

    // Send request to backend to create webhooks
    try {
      const webHookResponse = await axios.post(
        `${baseUrl}${apiPath}${webhookPath}`,
        {
          json: {
            repoUrl: repoUrl as string,
          },
        },
      );
    } catch (error) {
      console.warn("Webhook may have already been created");
    }

    console.log("Webhook successfully created!");

    console.log("Deploying database...");
    // Send request to backend to create database
    try {
      const createResponse = await axios.post(
        `${baseUrl}${apiPath}${createDatabasePath}`,
        {
          json: {
            repoUrl: repoUrl as string,
            provider: answers.dbProvider,
          },
        },
      );
    } catch (error) {
      console.warn("Database on this branch has already been deployed");
    }

    console.log("Deploying, this may take up to 10 minutes");

    // Send request to backend to create database
    for (let i = 0; i < 10; i++) {
      try {
        const endpointResponse = await axios.post(
          `${baseUrl}${apiPath}${endpointPath}`,
          {
            json: {
              repoUrl: repoUrl as string,
            },
          },
        );

        if (endpointResponse) {
          const endpointData = endpointResponse.data as EndpointResponse;
          console.log("Connection information:\n");
          console.log("\t" + endpointData.result.data.json.connection);
          console.log();
          // TODO: Automatically set connection as environment URL
          break;
        }
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 120000));
        console.warn("Retrying...");
      }
    }
  }
}

await main();
