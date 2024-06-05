import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { readFileSync } from "fs";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_SECRET_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

interface ChatResponse {
  choices: Choice[];
}

interface Choice {
  message: {
    content: string;
  };
}

async function generateDummyData(
  model: string,
  fields: string[],
): Promise<unknown> {
  console.log(
    `Generating dummy data for model ${model} with fields: ${fields.join(", ")}`,
  );
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const response: ChatResponse = (await openai.chat.completions.create({
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
    })) as ChatResponse;
    console.log("Response", response.choices[0]?.message.content);
    return response.choices[0]?.message.content;
  } catch (error) {
    console.error("Failed to generate dummy data:", error);
    throw error;
  }
}

async function dummyCreate(): Promise<unknown> {
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
        const dummyData: unknown = await generateDummyData(modelName, fields);
        if (dummyData) {
          // Use type assertion to safely access the model
          const model = prisma[modelName as keyof typeof prisma];
          if (model && prisma) {
            const createCommand = prisma[
              modelName.toLocaleLowerCase() as keyof typeof prisma
            ] as { create: (data: unknown) => unknown };
            const results: unknown = await createCommand.create({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              data: JSON.parse(dummyData as string),
            });
            console.log(`Data inserted for model ${modelName}`);
            return results;
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
