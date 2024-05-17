#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";

async function createPrismaSchema(language) {
  const dbProvider = language === "Python" ? "postgresql" : "mysql";
  const schemaContent = `
    datasource db {
      provider = "${dbProvider}"
      url      = env("DATABASE_URL")
    }

    generator client {
      provider = "prisma-client-${language.toLowerCase()}"
    }

    model User {
      id    Int    @id @default(autoincrement())
      name  String
      email String @unique
    }
  `;

  fs.writeFileSync("prisma/schema.prisma", schemaContent);
  console.log("Prisma schema created successfully.");
}

async function main() {
  const answers = await inquirer.prompt([
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
      when: answers => answers.deployDatabase,
    },
  ]);   
  const deployDatabaseStatus = answers.deployDatabase ? '' : 'no';
  console.log('you enetered that you wanted a '+ answers.backendLanguage + ' schema with ' + deployDatabaseStatus +'deployment of your database to the cloud and your token is '+ answers.token + ' thank you for entering your information get to coding' )
  await createPrismaSchema(answers.backendLanguage);
}

main();
