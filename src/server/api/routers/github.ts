import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { CreateWebhook, FetchBranches } from "~/server/external/github";

export const gitHubRouter = createTRPCRouter({
  makeWebhook: protectedProcedure
    .input(
      z.object({
        repoUrl: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { repoUrl } = input;
      return await CreateWebhook(repoUrl);
    }),

  fetchBranches: protectedProcedure
    .input(
      z.object({
        repoUrl: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { repoUrl } = input;
      return await FetchBranches(repoUrl);
    }),
});
