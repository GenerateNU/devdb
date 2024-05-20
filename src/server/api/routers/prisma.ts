import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import axios from "axios";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile } from "fs/promises";
const execAsync = promisify(exec);

export const githubWebhookRouter = createTRPCRouter({
  handlePush: publicProcedure
    .input(
      z.object({
        ref: z.string(),
        after: z.string(),
        repository: z.object({
          contents_url: z.string(),
        }),
        installation: z.object({
          id: z.number(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.ref === "refs/heads/main") {
        const contentUrl = input.repository.contents_url.replace(
          "{+path}",
          "prisma/schema.prisma",
        );
        try {
          const response = await axios.get(contentUrl, {
            headers: {
              Accept: "application/vnd.github.v3.raw",
            },
          });
          const schemaContent = response.data;

          // Save schemaContent to a local file or directly push to Prisma
          await writeFile(
            "Where the schema is being held",
            schemaContent,
            "utf8",
          );

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
