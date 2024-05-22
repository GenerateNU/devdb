import { z } from "zod";

import { protectedProcedure } from "~/server/api/trpc";
import { CreateDatabase, GetDatabaseConnection } from "~/server/external/aws";
import { DBProvider } from "~/server/external/types";

export const database = {
  create: protectedProcedure
    .input(
      z.object({ repoUrl: z.string(), provider: z.nativeEnum(DBProvider) }),
    )
    .mutation(async ({ ctx, input }) => {
      const branch = "main";

      const projectCount = await ctx.db.project.count({
        where: {
          repo: input.repoUrl,
        },
      });

      if (projectCount == 0) {
        await ctx.db.project.create({
          data: { repo: input.repoUrl },
        });
      }

      const newDb = await ctx.db.database.create({
        data: {
          branch: branch,
          projectRepo: input.repoUrl,
        },
      });

      const databaseName = newDb.id;

      const result = await CreateDatabase(databaseName, input.provider);

      return result;
    }),

  endpoint: protectedProcedure
    .input(z.object({ repoUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const dbResults = await ctx.db.database.findFirstOrThrow({
        select: {
          id: true,
        },
        where: {
          projectRepo: input.repoUrl,
        },
      });

      const result = await GetDatabaseConnection(dbResults.id);
      return {
        connection: result,
      };
    }),
};
