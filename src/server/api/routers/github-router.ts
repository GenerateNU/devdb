import { z } from "zod";
import { Octokit, App } from "octokit";

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
    makeWebhook: protectedProcedure
        .input(z.object({
            repo: z.string(),
            repoUrl: z.string().url(),
            events: z.array(z.string()).default(["push"]),
        }))
        .mutation(async ({ ctx, input }) => {
            const { repo, repoUrl, events } = input;

            // Placeholder... need to figure out how to get access token
            const accessToken = ctx.session.user.id;
            const owner = ctx.session.user.name;

            // Configure octokit client
            const octokit = new Octokit({
                auth: accessToken
            })

            try {
                const response = await octokit.request(`POST /repos/${owner}/${repo}/hooks`, {
                    owner: owner ?? "",
                    repo: repo,
                    name: 'web',
                    active: true,
                    events: [
                        'push',
                    ],
                    config: {
                        url: 'https://placeholder.com/github/push',
                        content_type: 'json',
                        // This value determines if host url must be verified for payloads
                        insecure_ssl: '1'
                    },
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                })

                // Assuming successful creation of webhook
                return response.data;
            } catch (error) {
                throw new Error("Failed to create webhook: " + error);
            }
        }),
});
