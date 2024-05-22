import {
  RDSClient,
  CreateDBInstanceCommand,
  DescribeDBInstancesCommand,
  DBInstanceNotFoundFault,
} from "@aws-sdk/client-rds";
import type { DBProvider } from "./types";

const client = new RDSClient({ region: "us-east-1" });

export async function CreateDatabase(
  name: string,
  provider: DBProvider,
): Promise<string> {
  const commandInput = {
    AllocatedStorage: 20,
    DBInstanceClass: "db.t3.micro",
    DBInstanceIdentifier: name,
    Engine: provider,
    MasterUsername: "dev",
    MasterUserPassword: "devpassword123",
  };
  const command = new CreateDBInstanceCommand(commandInput);
  const result = await client.send(command);

  try {
    const endpoint = await GetDatabaseConnection(
      result.DBInstance?.DBInstanceIdentifier,
    );
    if (endpoint) return endpoint;
    else throw Error("Problem getting connection detail.");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function GetDatabaseConnection(
  instanceId: string | undefined,
): Promise<string | undefined> {
  const retries = 10;
  const retryInterval = 120000;
  const input = {
    // DescribeDBInstancesMessage
    DBInstanceIdentifier: instanceId,
  };
  const command = new DescribeDBInstancesCommand(input);

  for (let i = 0; i < retries; i++) {
    console.log(`Attempt #${i}`);
    try {
      const response = await client.send(command);

      if (response.DBInstances) {
        if (response.DBInstances?.length < 1) {
          throw Error("Database not found");
        } else if (response.DBInstances[0]?.DBInstanceStatus == "Available") {
          const provider = response.DBInstances[0].Engine;
          const username = "dev";
          const password = "devpassword123";
          const awsEndpoint = response.DBInstances[0].Endpoint?.Address; //"test-database.cw6wi7ttmo36.us-east-1.rds.amazonaws.com";
          const port = response.DBInstances[0].Endpoint?.Port;
          const dbName = response.DBInstances[0].DBName;

          const connection = `${provider}://${username}:${password}@${awsEndpoint}:${port}/${dbName}`;

          return connection;
        } else {
          console.log("retrying...");
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }
      }
    } catch (error) {
      if (error instanceof DBInstanceNotFoundFault) {
        throw error;
      } else {
        console.error(error);
        // Sleep before retry
      }
    }
  }
}
