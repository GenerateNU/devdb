import gitUrlParse from "git-url-parse";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "~/server/api/trpc";
import {
  CreateRDSInstance,
  DeleteRDSInstance,
  GetRDSConnectionURL,
  GetRDSInstanceStatus,
  StartRDSInstance,
  StopRDSInstance,
} from "~/server/external/aws";
import { DBProvider } from "~/server/external/types";

export const project = {
  get: protectedProcedure
    .input(z.object({ searchTerms: z.string() }))
    .query(async ({ ctx, input }) => {
      const prisma = ctx.db.$extends({
        result: {
          project: {
            status: {
              compute(project) {
                return project.rdsInstanceId ? "Unknown" : "No Database";
              },
            },
          },
        },
      });

      const searchResults = await prisma.project.findMany({
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

      return await Promise.all(
        searchResults.map(async (project) => {
          return project.rdsInstanceId
            ? {
                ...project,
                status: await GetRDSInstanceStatus(project.rdsInstanceId),
              }
            : project;
        }),
      );
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

      const result = await CreateRDSInstance(id, input.provider);

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

      const { rdsInstanceId } = await ctx.db.project.delete({
        where: {
          repository: input.repoUrl,
        },
      });

      console.log(rdsInstanceId);

      if (rdsInstanceId) {
        return await DeleteRDSInstance(rdsInstanceId);
      } else {
        throw Error("No RDS Instance found, cannot delete");
      }
    }),

  endpoint: protectedProcedure
    .input(z.object({ repoUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { rdsInstanceId } = await ctx.db.project.findFirstOrThrow({
        select: {
          rdsInstanceId: true,
        },
        where: {
          repository: input.repoUrl,
        },
      });

      console.log(rdsInstanceId);

      if (rdsInstanceId) {
        return await GetRDSConnectionURL(rdsInstanceId);
      } else {
        throw Error("No RDS Instance found, cannot start");
      }
    }),

  start: protectedProcedure
    .input(z.object({ repoUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { rdsInstanceId } = await ctx.db.project.findFirstOrThrow({
        select: {
          rdsInstanceId: true,
        },
        where: {
          repository: input.repoUrl,
        },
      });

      console.log(rdsInstanceId);

      if (rdsInstanceId) {
        return await StartRDSInstance(rdsInstanceId);
      } else {
        throw Error("No RDS Instance found, cannot start");
      }
    }),

  stop: protectedProcedure
    .input(z.object({ repoUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { rdsInstanceId } = await ctx.db.project.findFirstOrThrow({
        select: {
          rdsInstanceId: true,
        },
        where: {
          repository: input.repoUrl,
        },
      });

      console.log(rdsInstanceId);

      if (rdsInstanceId) {
        return await StopRDSInstance(rdsInstanceId);
      } else {
        throw Error("No RDS Instance found, cannot stop");
      }
    }),

  status: publicProcedure
    .input(z.object({ rdsInstanceId: z.string() }))
    .query(async ({ input }) => {
      return GetRDSInstanceStatus(input.rdsInstanceId);
    }),

  nuke: protectedProcedure.mutation(async ({ ctx }) => {
    const rdsInstances = await ctx.db.rDSInstance.findMany({
      select: {
        id: true,
      },
    });

    rdsInstances.forEach((instance) => {
      DeleteRDSInstance(instance.id)
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
