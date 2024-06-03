import { PrismaClient } from "@prisma/client";
import axios from "axios";
import OpenAI from "openai";
import { readFileSync } from "fs";

const prisma = new PrismaClient();
const openAiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  organization: "org-P089j4RF5ZRlf84V2IcFipaS",
  project: "$PROJECT_ID",
});

async function generateDummyData(model: string, fields: string[]) {
  try {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Generate a JSON object with realistic dummy data for these fields of a ${model}: ${fields.join(", ")}`,
      max_tokens: 150,
    });

    return response;
  } catch (error) {
    console.error("Failed to generate dummy data:", error);
    return null;
  }
}

async function main() {
  const schema = readFileSync("./prisma/schema.prisma", "utf8");
  // Simplified parser for demonstration purposes. Consider a robust parser for real applications.
  const models = schema.match(/model \w+ {[^}]+}/g);

  if (models) {
    for (const modelDef of models) {
      const modelName = modelDef.match(/model (\w+) {/)?.[1];
      const fields = modelDef
        .match(/\w+:/g)
        ?.map((field) => field.slice(0, -1));

      if (modelName && fields) {
        const dummyData = await generateDummyData(modelName, fields);
        if (dummyData) {
          await prisma[modelName].create({ data: dummyData });
          console.log(`Data inserted for model ${modelName}`);
        }
      }
    }
  }

  await prisma.$disconnect();
}

main();
