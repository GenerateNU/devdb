import { protectedProcedure } from "~/server/api/trpc";

export const greeting = protectedProcedure.query(async () => {
  return "Hello DevDB user!";
});
