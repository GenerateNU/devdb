import { z } from "zod";

import { publicProcedure } from "~/server/api/trpc";

export const greeting = publicProcedure
  .input(z.object({ text: z.string() }))
  .mutation(async ({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  });
