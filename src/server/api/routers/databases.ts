import { z } from "zod";

import { RDSClient, CreateDBInstanceCommand } from "@aws-sdk/client-rds";

import { publicProcedure } from "~/server/api/trpc";
import process from "process";

const client = new RDSClient({ region: "us-east-1" });

export const database = publicProcedure
  .input(z.object({ name: z.string() }))
  .mutation(async ({ input }) => {
    const commandInput = {
      AllocatedStorage: 20,
      DBInstanceClass: "db.t3.micro",
      DBInstanceIdentifier: input.name,
      Engine: "mysql",
      MasterUserPassword: process.env.AWS_MASTER_PASSWORD,
      MasterUsername: process.env.AWS_MASTER_USERNAME,
    };
    const command = new CreateDBInstanceCommand(commandInput);
    const result = await client.send(command);

    return result;
  });
