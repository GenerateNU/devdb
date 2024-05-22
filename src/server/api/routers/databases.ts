import { z } from "zod";

import { publicProcedure } from "~/server/api/trpc";
import { CreateDatabase } from "~/server/external/aws";
import { DBProvider } from "~/server/external/types";

export const database = publicProcedure
  .input(z.object({ name: z.string(), provider: z.nativeEnum(DBProvider) }))
  .mutation(async ({ input }) => {
    const result = await CreateDatabase(input.name, input.provider);

    return result;
  });
