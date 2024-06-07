import {
  RDSClient,
  CreateDBInstanceCommand,
  DescribeDBInstancesCommand,
  DBInstanceNotFoundFault,
  DeleteDBInstanceCommand,
  StartDBInstanceCommand,
  StopDBInstanceCommand,
  type CreateDBInstanceCommandOutput,
  type DeleteDBInstanceCommandOutput,
  type DeleteDBInstanceCommandInput,
  type CreateDBInstanceCommandInput,
  type StartDBInstanceCommandInput,
  type StartDBInstanceResult,
  type StopDBInstanceResult,
  type StopDBInstanceCommandInput,
} from "@aws-sdk/client-rds";
import type { DBProvider } from "./types";

const client = new RDSClient({ region: "us-east-1" });

export async function CreateDatabase(
  name: string,
  provider: DBProvider,
): Promise<CreateDBInstanceCommandOutput> {
  const commandInput: CreateDBInstanceCommandInput = {
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

export async function DeleteDatabase(
  name: string,
): Promise<DeleteDBInstanceCommandOutput> {
  const commandInput: DeleteDBInstanceCommandInput = {
    DBInstanceIdentifier: name,
    SkipFinalSnapshot: true,
  };

  console.log(commandInput);

  const command = new DeleteDBInstanceCommand(commandInput);
  const result = client.send(command);

  return result;
}

export async function GetDatabaseStatus(instanceId: string): Promise<string> {
  const input = {
    DBInstanceIdentifier: instanceId,
  };
  const command = new DescribeDBInstancesCommand(input);

  const response = await client.send(command);

  if (response.DBInstances) {
    if (response.DBInstances?.length > 1) {
      const status = response.DBInstances[0]?.DBInstanceStatus;
      console.log(status);
      return status ?? "Unknown";
    }
  }

  return "Could not fetch";
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

export async function StartDatabase(
  name: string,
): Promise<StartDBInstanceResult> {
  const input: StartDBInstanceCommandInput = {
    DBInstanceIdentifier: name,
  };
  const command = new StartDBInstanceCommand(input);
  const result = await client.send(command);

  return result;
}

export async function StopDatabase(
  name: string,
): Promise<StopDBInstanceResult> {
  const input: StopDBInstanceCommandInput = {
    DBInstanceIdentifier: name,
  };
  const command = new StopDBInstanceCommand(input);
  const result = await client.send(command);

  return result;
}
