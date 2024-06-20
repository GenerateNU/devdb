import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { exec } from "child_process";
import { promisify } from "util";

export function ReplaceSchemaConnection(
  original: string,
  connection: string,
): string {
  const regex = /(url\s*=\s*)(.*)(\n)/g;

  const replaced = original.replace(regex, `$1"${connection}"$3`);

  return replaced;
}

export async function PushPrismaSchema(
  owner: string,
  name: string,
  branch: string,
  baseConnection: string,
  schemaContent: string,
) {
  if (!existsSync("./temp")) {
    mkdirSync("./temp");
  }
  const savedPath = `./temp/${owner}-${name}-schema.prisma`;
  const fullConnection = `${baseConnection}/${branch}`;
  const fixedSchema = ReplaceSchemaConnection(schemaContent, fullConnection);

  const execAsync = promisify(exec);

  // Save replacedSchemaContent to a local file
  await writeFile(savedPath, fixedSchema);

  // Apply changes using Prisma
  const { stdout, stderr } = await execAsync(
    `bunx prisma db push --schema=${savedPath}`,
  );

  console.log(stdout);
  if (stderr) {
    console.error("Error during database push:", stderr);
    throw new Error("Failed to update database schema");
  }
}
