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
  get: protectedProcedure
    .input(z.object({ searchTerms: z.string() }))
    .query(async ({ ctx, input }) => {
      const searchResults = ctx.db.project.findMany({
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
          branches: {
            include: {
              createdBy: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return searchResults;
    }),

  create: protectedProcedure
    .input(
      z.object({ repoUrl: z.string(), provider: z.nativeEnum(DBProvider) }),
    )
    .mutation(async ({ ctx, input }) => {
      const branch = "main";

      const projectCount = await ctx.db.project.count({
        where: {
          repository: input.repoUrl,
        },
      });

      const { id } = await ctx.db.rDSInstance.create({ data: {} });

      if (projectCount == 0) {
        await ctx.db.project.create({
          data: {
            repository: input.repoUrl,
            createdById: ctx.session.user.id,
            rdsInstanceId: id,
          },
        });
      }

      await ctx.db.branch.create({
        data: {
          name: branch,
          projectRepository: input.repoUrl,
          createdById: ctx.session.user.id,
        },
      });

      const result = await CreateDatabase(id, input.provider);

      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ repoUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const findResults = await ctx.db.project.findFirstOrThrow({
        select: {
          rdsInstanceId: true,
        },
        where: {
          repository: input.repoUrl,
        },
      });

      console.log(findResults);

      const deleteResults = await ctx.db.project.delete({
        where: {
          repository: input.repoUrl,
        },
      });

      console.log(deleteResults);

      const result = await DeleteDatabase(findResults.rdsInstanceId);

      return result;
    }),

  endpoint: protectedProcedure
    .input(z.object({ repoUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const dbResults = await ctx.db.project.findFirstOrThrow({
        select: {
          rdsInstanceId: true,
        },
        where: {
          repository: input.repoUrl,
        },
      });

      console.log(dbResults);

      const result = await GetDatabaseConnection(dbResults.rdsInstanceId);
      return {
        connection: result,
      };
    }),

  start: protectedProcedure
    .input(z.object({ repoUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const dbResults = await ctx.db.project.findFirstOrThrow({
        select: {
          rdsInstanceId: true,
        },
        where: {
          repository: input.repoUrl,
        },
      });

      console.log(dbResults);

      const result = await StartDatabase(dbResults.rdsInstanceId);
      return result;
    }),

  stop: protectedProcedure
    .input(z.object({ repoUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const dbResults = await ctx.db.project.findFirstOrThrow({
        select: {
          rdsInstanceId: true,
        },
        where: {
          repository: input.repoUrl,
        },
      });

      console.log(dbResults);

      const result = await StopDatabase(dbResults.rdsInstanceId);
      return result;
    }),
};
