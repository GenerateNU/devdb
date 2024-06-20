import { db } from "../db";
import { PushPrismaSchema } from "../../app/api/github/utils";
import { GetRDSConnectionURL } from "../external/aws";
import { GetSchemaContents } from "../external/github";

// To handle a POST request to /api/github
export async function PushSchemaFromBranch(
  repository: string,
  branch: string,
  owner: string,
  name: string,
) {
  // See if the branch has a database
  const branchInfo = await db.branch.findFirst({
    where: {
      name: branch,
    },
    include: {
      project: {
        include: {
          rdsInstance: true,
        },
      },
    },
  });

  if (branch && branchInfo?.project.rdsInstanceId) {
    // Fetch the content of the Prisma schema file using Octokit
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await GetSchemaContents(repository, branch);

    if (!Array.isArray(data) && data) {
      const baseConnection = await GetRDSConnectionURL(
        branchInfo.project.rdsInstanceId,
      );
      const content = data as unknown as string;

      if (baseConnection && data) {
        await PushPrismaSchema(owner, name, branch, baseConnection, content);
      } else {
        console.error("Base connection not yet available. Try again later");
      }
    } else {
      console.error("Is directory");
    }
  }
}
