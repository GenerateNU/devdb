import { Octokit } from "@octokit/rest";
import { db } from "../db";
import { PushPrismaSchema } from "../../app/api/github/utils";
import { GetRDSConnectionURL } from "../external/aws";

// Initialize Octokit with an access token
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

// To handle a POST request to /api/github
export async function PushSchemaFromBranch(
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
    const { data } = await octokit.repos.getContent({
      owner: owner,
      repo: name,
      path: "prisma/schema.prisma",
      mediaType: {
        format: "raw",
      },
    });

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
