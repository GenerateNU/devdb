import { expect, test } from "bun:test";
import { ReplaceSchemaConnection } from "./utils";

test("Replace connection URL in Prisma schema", () => {
  expect(
    ReplaceSchemaConnection('url      = env("DATABASE_URL")\n', "TEST"),
  ).toBe('url      = "TEST"\n');
});

test("Replace connection URL in Prisma schema", () => {
  expect(
    ReplaceSchemaConnection(
      `datasource db {
    provider = "postgresql"
    // NOTE: When using mysql or sqlserver, uncomment the @db.Text annotations in model Account below
    // Further reading:
    // https://next-auth.js.org/adapters/prisma#create-the-prisma-schema
    // https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#string
    url      = env("DATABASE_URL")
}`,
      "TEST",
    ),
  ).toBe(`datasource db {
    provider = "postgresql"
    // NOTE: When using mysql or sqlserver, uncomment the @db.Text annotations in model Account below
    // Further reading:
    // https://next-auth.js.org/adapters/prisma#create-the-prisma-schema
    // https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#string
    url      = "TEST"
}`);
});
