#!/usr/bin/env node
import {Command} from 'commander';
import inquirer from 'inquirer';

const program = new Command();

program
  .command('generate-routes')
  .description('Generate routes for your application')
  .action(async () => {
    const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'backendLanguage',
          message: 'What backend language are you using?',
          choices: ['TypeScript', 'Python', 'Go'],
        },
        {
          type: 'confirm',
          name: 'deployDatabase',
          message: 'Do you want to deploy a database to the cloud?',
        },
        {
          type: 'input',
          name: 'token',
          message: 'Enter your cloud database token:'
        },
      ]) as { backendLanguage: string, deployDatabase: boolean, token?: string };
      
      console.log(`You chose ${answers.backendLanguage} with deployment: ${answers.deployDatabase}`);
      if (answers.token) {
        console.log(`Token: ${answers.token}`);
      }
      
    // Additional logic to handle Prisma setup and schema initialization
  });

program.parse(process.argv);