import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Octokit } from "@octokit/rest";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile } from "fs/promises";
const execAsync = promisify(exec);

// Initialize Octokit with an access token
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export const githubWebhookRouter = createTRPCRouter({
  handlePush: publicProcedure
    .input(
      z.object({
        ref: z.string(),
        after: z.string(),
        repository: z.object({
          owner: z.string(),
          name: z.string(),
        }),
        installation: z.object({
          id: z.number(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
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
          await writeFile("prisma/schema.prisma", schemaContent, "utf8");

          // Apply changes using Prisma
          const { stdout, stderr } = await execAsync("npx prisma db push");
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

      return { ignored: true };
    }),
});
