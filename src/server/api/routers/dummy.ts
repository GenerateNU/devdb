import { z } from "zod";

import dummyCreate from "~/server/dummyData";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dummy = createTRPCRouter({
  testDummy: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async () => {
      const results = await dummyCreate();

      return results;
    }),
});
