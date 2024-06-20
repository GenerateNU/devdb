import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";

export default async function updateExistingEnvVariable(
  varName: string,
  newValue: string,
): Promise<boolean> {
  try {
    // Path to the .env file
    const filePath = ".env";
    const content = existsSync(filePath) ? await readFile(filePath) : "";

    // Split the content into lines
    const lines = content.toString().split("\n");

    let missingVar = true;

    // Update the line containing the variable
    const updatedLines = lines.map((line: string) => {
      if (line.startsWith(varName)) {
        missingVar = false;
        // Update the value of the variable
        return `${varName}=${newValue}`;
      }
      return line;
    });

    if (missingVar) {
      updatedLines.push(`${varName}=${newValue}`);
    }

    // Join the updated lines back into a single string
    const updatedContent = updatedLines.join("\n");

    // Write the updated contents back to the .env.example file
    await writeFile(filePath, updatedContent, { flag: "w+" });
    //potentially add utf8 above if it fails
    const verifyContent = await readFile(filePath, "utf8");
    return verifyContent.includes(`${varName}=${newValue}`);
  } catch (error) {
    console.error("Failed to update .env.example:", error);
    return false;
  }
}
