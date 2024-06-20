import { z } from "zod";

import dummyCreate from "~/server/dummyData";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dummy = createTRPCRouter({
  testDummy: publicProcedure
    .input(
      z.object({
        repository: z.string(),
        branch: z.string(),
        models: z.array(z.object({ name: z.string(), count: z.number() })),
      }),
    )
    .mutation(async ({ input }) => {
      const { repository, branch, models } = input;
      const results = await dummyCreate(repository, branch, models);

      return results;
    }),
});
