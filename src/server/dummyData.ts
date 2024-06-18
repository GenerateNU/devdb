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
  schema: string,
): Promise<unknown> {
  console.log(
    `Generating dummy data for model ${model} with fields: ${fields.join(", ")}`,
  );
  try {
    const response: ChatResponse = (await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert data generator. Create a singular JSON object with realistic dummy data for a ${model} model with the following fields: ${fields.join(
            ", ",
          )}. 
          Guidelines:
          - Please use this ${schema} to reference any relationships between models.
          - Return strictly plain JSON that's not embedded, and without extraneous marks.
          - Do not generate fields that are unique IDs.
          - Each field should have a maximum of 20 characters per entry unless specified otherwise.
          - DateTime fields should be in the format "YYYY-MM-DDTHH:MM:SSZ" (e.g., 2022-03-15T10:00:00Z).
          - For fields with comments, follow the instructions in the comments.
          - For nested fields, use the Prisma nested create syntax. If using createMany for a nested field,
          ignore any of the parent model's fields that are not required.
          - Ensure that related records are created with valid references or data.
          Example syntax for nested fields:
          {
            "email": "saanvi@prisma.io",
            "posts": {
              "createMany": {
                "data": [
                  { "title": "My first post" }, 
                  { "title": "My second post" }
                ]
              }
            }
          }
          Return only the JSON object.`,
        },
      ],
      max_tokens: 4096,
    })) as ChatResponse;
    console.log("Response", response.choices[0]?.message.content);
    return response.choices[0]?.message.content;
  } catch (error) {
    console.error("Failed to generate dummy data:", error);
    throw error;
  }
}

async function dummyCreate(): Promise<{ message: string }> {
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

      if (modelName && fields && (modelName == "Post" || modelName == "Like")) {
        const dummyData: unknown = await generateDummyData(modelName, fields, schema);
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
  return { message: "Dummy data created successfully." };
}

export default dummyCreate;
