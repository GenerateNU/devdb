import {
  RDSClient,
  CreateDBInstanceCommand,
  DescribeDBInstancesCommand,
  DBInstanceNotFoundFault,
  type CreateDBInstanceCommandOutput,
} from "@aws-sdk/client-rds";
import type { DBProvider } from "./types";

const client = new RDSClient({ region: "us-east-1" });

export async function CreateDatabase(
  name: string,
  provider: DBProvider,
): Promise<CreateDBInstanceCommandOutput> {
  const commandInput = {
    DBName: "defaultdb",
    AllocatedStorage: 20,
    DBInstanceClass: "db.t3.micro",
    DBInstanceIdentifier: name,
    Engine: provider,
    MasterUsername: "dev",
    MasterUserPassword: "devpassword123",
  };
  const command = new CreateDBInstanceCommand(commandInput);
  const result = client.send(command);

  return result;
}

export async function GetDatabaseConnection(
  instanceId: string | undefined,
): Promise<string | undefined> {
  const input = {
    // DescribeDBInstancesMessage
    DBInstanceIdentifier: instanceId,
  };
  const command = new DescribeDBInstancesCommand(input);

  try {
    const response = await client.send(command);

    if (response.DBInstances) {
      if (response.DBInstances?.length < 1) {
        throw Error("Database not found");
      } else if (response.DBInstances[0]?.DBInstanceStatus === "available") {
        const provider = response.DBInstances[0].Engine;
        const username = "dev";
        const password = "devpassword123";
        const awsEndpoint = response.DBInstances[0].Endpoint?.Address; //"test-database.cw6wi7ttmo36.us-east-1.rds.amazonaws.com";
        const port = response.DBInstances[0].Endpoint?.Port;
        const dbName = response.DBInstances[0].DBName;

        const connection = `${provider}://${username}:${password}@${awsEndpoint}:${port}/${dbName}`;

        return connection;
      } else {
        throw Error(
          `Database not yet available, current status: ${response.DBInstances[0]?.DBInstanceStatus}`,
        );
      }
    }
  } catch (error) {
    if (error instanceof DBInstanceNotFoundFault) {
      throw error;
    } else {
      throw error;
    }
  }
}
