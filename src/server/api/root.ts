import { gitHubRouter } from "./routers/github-router";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { greeting } from "./routers/greeting";
import { project } from "./routers/project";
import { githubWebhookRouter } from "./routers/prisma";
import { dummy } from "./routers/dummy";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  github: gitHubRouter,
  greeting: greeting,
  database: project,
  webhook: githubWebhookRouter,
  dummy: dummy,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
