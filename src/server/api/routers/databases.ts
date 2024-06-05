import { z } from "zod";

import { protectedProcedure } from "~/server/api/trpc";
import {
  CreateDatabase,
  DeleteDatabase,
  GetDatabaseConnection,
  StartDatabase,
  StopDatabase,
} from "~/server/external/aws";
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

  delete: protectedProcedure
    .input(z.object({ repoUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const findResults = await ctx.db.database.findFirstOrThrow({
        select: {
          id: true,
        },
        where: {
          projectRepo: input.repoUrl,
        },
      });

      console.log(findResults);

      const deleteResults = await ctx.db.database.delete({
        where: {
          id: findResults.id,
        },
      });

      console.log(deleteResults);

      const result = await DeleteDatabase(findResults.id);

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

      console.log(dbResults);

      const result = await GetDatabaseConnection(dbResults.id);
      return {
        connection: result,
      };
    }),

  start: protectedProcedure
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

      console.log(dbResults);

      const result = await StartDatabase(dbResults.id);
      return result;
    }),

  stop: protectedProcedure
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

      console.log(dbResults);

      const result = await StopDatabase(dbResults.id);
      return result;
    }),
};
