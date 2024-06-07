import gitUrlParse from "git-url-parse";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "~/server/api/trpc";
import {
  CreateDatabase,
  DeleteDatabase,
  GetDatabaseConnection,
  GetDatabaseStatus,
  StartDatabase,
  StopDatabase,
} from "~/server/external/aws";
import { DBProvider } from "~/server/external/types";

export const database = {
  get: protectedProcedure
    .input(z.object({ searchTerms: z.string() }))
    .query(async ({ ctx, input }) => {
      const searchResults = await ctx.db.project.findMany({
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
        where: {
          ...(input.searchTerms !== ""
            ? {
                repositoryName: {
                  search: input.searchTerms,
                },
              }
            : {}),
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      const statusIncluded = searchResults.map(async (project) => {
        const status = await GetDatabaseStatus(project.rdsInstanceId);

        const newProject: typeof project & { status: string } = {
          ...project,
          status: status,
        };

        return newProject;
      });

      return searchResults;
    }),

  create: protectedProcedure
    .input(
      z.object({ repoUrl: z.string(), provider: z.nativeEnum(DBProvider) }),
    )
    .mutation(async ({ ctx, input }) => {
      const branch = "main";

      const parsedUrl = gitUrlParse(input.repoUrl);

      const { owner, name, href } = parsedUrl;

      const { id } = await ctx.db.rDSInstance.create({ data: {} });

      await ctx.db.project.create({
        data: {
          owner: href.split("/").slice(0, -1).join("/"),
          ownerName: owner,
          repository: href,
          repositoryName: name,
          createdById: ctx.session.user.id,
          rdsInstanceId: id,
        },
      });

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

  status: publicProcedure
    .input(z.object({ rdsInstanceId: z.string() }))
    .query(async ({ input }) => {
      return GetDatabaseStatus(input.rdsInstanceId);
    }),

  nuke: protectedProcedure.mutation(async ({ ctx }) => {
    const rdsInstances = await ctx.db.rDSInstance.findMany({
      select: {
        id: true,
      },
    });

    rdsInstances.forEach((instance) => {
      DeleteDatabase(instance.id)
        .then((value) => {
          console.log(
            `${instance.id} deleted: ${value.DBInstance?.DBInstanceIdentifier}`,
          );

          ctx.db.rDSInstance
            .delete({
              where: {
                id: instance.id,
              },
            })
            .then((value) => console.log(value.id))
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
    });
  }),
};
