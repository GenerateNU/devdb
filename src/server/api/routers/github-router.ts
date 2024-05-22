import { z } from "zod";
import { App } from "octokit";
import { readFileSync } from "fs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// GitHub router
export const gitHubRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // Webhook endpoint
  makeWebhook: publicProcedure
    .input(
      z.object({
        repo: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { repo } = input;
      // TODO: Replace with actual owner
      const owner = "GenerateNU"

      const privatePem = readFileSync("private-key.pem", {
        encoding: "utf-8",
      });

      const app = new App({
        appId: process.env.GITHUB_APP_ID ?? "",
        privateKey: privatePem,
      });

      const response = await app.octokit.request(
        `GET /repos/${owner}/${repo}/installation`,
        {
          owner: owner,
          repo: repo,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const installationId: number = response.data.id;

      const octokit = await app.getInstallationOctokit(installationId);

      try {
        const response = await octokit.request(
          `POST /repos/${owner}/${repo}/hooks`,
          {
            owner: owner,
            repo: repo,
            name: "web",
            active: true,
            events: ["push", "pull_request"],
            config: {
              // to be replaced with actual webhook URL
              url: "https://example.com/webhook",
              content_type: "json",
              insecure_ssl: "1",
            },
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          },
        );

        // Assuming successful creation of webhook
        console.log(response.data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response.data;
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Failed to create webhook: ${error}`);
      }
    }),
});
