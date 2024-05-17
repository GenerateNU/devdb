#!/usr/bin/env node

import inquirer from "inquirer";

await inquirer.prompt([
  {
    type: "list",
    name: "backendLanguage",
    message: "What backend language are you using?",
    choices: ["TypeScript", "Python", "Go"],
  },
  {
    type: "confirm",
    name: "deployDatabase",
    message: "Do you want to deploy a database to the cloud?",
  },
  {
    type: "input",
    name: "token",
    message: "Enter your cloud database token:",
  },
]);