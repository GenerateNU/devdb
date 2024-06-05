import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { readFileSync } from "fs";

const prisma = new PrismaClient();
const openAiApiKey = process.env.OPENAI_API_SECRET_KEY;

const openai = new OpenAI({
  apiKey: openAiApiKey,
  organization: "org-P089j4RF5ZRlf84V2IcFipaS",
});

async function generateDummyData(model: string, fields: string[]) {
  console.log(
    `Generating dummy data for model ${model} with fields: ${fields.join(", ")}`,
  );
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Create a singular JSON object with realistic one example of dummy data for a ${model} model with fields: ${fields.join(
            ", ",
          )}. Please include all fields and have a maximum of 20 characters per field entry`,
        },
      ],
      max_tokens: 500,
    });
    console.log("Response", response.choices[0]?.message.content);
    return response.choices[0]?.message.content;
  } catch (error) {
    console.error("Failed to generate dummy data:", error);
    return null;
  }
}

async function dummyCreate() {
  console.log("Creating dummy data...");
  const schema = readFileSync("./prisma/schema.prisma", "utf8");
  const models = schema.match(/model \w+ {[^}]+}/g);
  console.log(models);

  if (models) {
    for (const modelDef of models) {
      console.log(modelDef);
      const modelName = modelDef.match(/model (\w+) {/)?.[1];
      console.log(modelName);
      const fields = modelDef
        .match(" {([^}]+)}")
        ?.map((field) => field.slice(0, -1));

      console.log(fields);

      if (modelName && fields) {
        const dummyData = await generateDummyData(modelName, fields);
        if (dummyData) {
          // Use type assertion to safely access the model
          const model = prisma[modelName as keyof typeof prisma];
          if (model) {
            // @ts-ignore
            await prisma[modelName.toLocaleLowerCase()].create({
              data: JSON.parse(dummyData),
            });
            console.log(`Data inserted for model ${modelName}`);
          } else {
            console.error(
              `Model ${modelName} does not exist in Prisma Client.`,
            );
          }
        }
      }
    }
  }

  await prisma.$disconnect();
}

export default dummyCreate;
