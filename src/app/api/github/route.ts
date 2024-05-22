import { Octokit } from "@octokit/rest";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";

const execAsync = promisify(exec);

// Initialize Octokit with an access token
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

// To handle a POST request to /api/github
export async function POST(request: {
  ref: string;
  repository: { owner: string; name: string };
}) {
  const input = request;

  if (input.ref === "refs/heads/main") {
    try {
      // Fetch the content of the Prisma schema file using Octokit
      const response = await octokit.repos.getContent({
        owner: input.repository.owner,
        repo: input.repository.name,
        path: "prisma/schema.prisma",
        mediaType: {
          format: "raw",
        },
      });

      const schemaContent = response.data as unknown as string;

      // Save schemaContent to a local file
      await writeFile("./temp/schema.prisma", schemaContent, "utf8");

      // Apply changes using Prisma
      const { stdout, stderr } = await execAsync(
        "bunx prisma db push --schema=./temp/schema.prisma",
      );
      console.log(stdout);
      if (stderr) {
        console.error("Error during database push:", stderr);
        throw new Error("Failed to update database schema");
      }
      return { success: true };
    } catch (error) {
      console.error("Failed to handle GitHub push:", error);
      throw new Error("Failed to handle GitHub push");
    }
  }

  // Do whatever you want
  return NextResponse.json({ ignored: true }, { status: 200 });
}
