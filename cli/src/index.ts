#!/usr/bin/env node

import inquirer from "inquirer";
import parse, { type Config } from "parse-git-config";
import type { CLIAnswers, EndpointResponse } from "./types";
import parseGithubUrl from "parse-github-url";
import axios from "axios";
import updateExistingEnvVariable from "./utils/updateEnv";
import SetupCLI from "./menu/setup";
import { exit } from "process";

export const baseUrl = "https://routes-orcin.vercel.app/";
export const apiPath = "api/trpc/";
const createDatabasePath = "database.create";
const endpointPath = "database.endpoint";

// Create an Axios instance
const axiosInstance = axios.create({
  withCredentials: true, // Ensure credentials are sent with every request
});

async function askRetry(): Promise<boolean> {
  const answers = (await inquirer.prompt([
    {
      type: "confirm",
      name: "retry",
      message: "Do you want to try updating the environment variable again?",
      default: false,
    },
  ])) as { retry: boolean };
  return answers.retry;
}

//this is where the cli code is generated to ensure we are able to get the user info
async function main() {
  await SetupCLI();

  process.exit(1);
  /* 
  const config: Config = parse.expandKeys(parse.sync());

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const repoUrl = config?.remote?.origin?.url;

  const answers: CLIAnswers = (await inquirer.prompt([
    {
      type: "list",
      name: "backendLanguage",
      message:
        "What backend language are you using? (Other clients will be added later)",
      choices: ["TypeScript"],
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
      type: "confirm",
      name: "correctRepo",
      message: `Is ${repoUrl} your correct repo?`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      when: (answers) => answers.deployDatabase === true,
    },
  ])) as CLIAnswers;

  if (answers.deployDatabase) {
    const parsedUrl = parseGithubUrl(repoUrl as string);
    console.log("Name:", parsedUrl?.name); // repositoryName

    if (!repoUrl) {
      console.error("No repo found in git config");
      process.exit(1);
    }

    console.log("Deploying database...");
    // Send request to backend to create database
    try {
      await axiosInstance.post(`${baseUrl}${apiPath}${createDatabasePath}`, {
        json: {
          repoUrl: repoUrl as string,
          provider: answers.dbProvider,
        },
      });
    } catch (error) {
      console.warn("Database on this branch has already been deployed");
    }

    console.log("Deploying, this may take up to 10 minutes");

    // Send request to backend to create database
    for (let i = 0; i < 120; i++) {
      try {
        const endpointResponse = await axiosInstance.post(
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

          // Automatically set connection as environment URL
          let retrySetEnv = true;
          while (retrySetEnv) {
            const success = await updateExistingEnvVariable(
              "DATABASE_URL",
              endpointData.result.data.json.connection,
            );
            if (success) {
              console.log("Environment variable updated successfully.");
              break;
            } else {
              console.error("Failed to update environment variable.");
              retrySetEnv = await askRetry();
            }
          }
          break;
        }
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        console.warn("Retrying...");
      }
    }
  } */
}

await main();
