import { z } from "zod";

import dummyCreate from "~/server/dummyData";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const dummy = createTRPCRouter({
  testDummy: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async () => {
      const results = await dummyCreate();

      return results;
    }),
});
