import { App } from "octokit";
import gitUrlParse from "git-url-parse";

async function GetOctokitInstallation(owner: string, name: string) {
  const app = new App({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_PRIVATE_KEY!,
  });

  const response = await app.octokit.request(
    `GET /repos/${owner}/${name}/installation`,
    {
      owner: owner,
      repo: name,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const installationId: number = response.data.id;

  return await app.getInstallationOctokit(installationId);
}

export async function GetSchemaContents(repoUrl: string, branch: string) {
  const parsedUrl = gitUrlParse(repoUrl);
  const { owner, name } = parsedUrl;

  const octokit = await GetOctokitInstallation(owner, name);
  const response = await octokit.request(
    `GET /repos/${owner}/${name}/contents/{path}`,
    {
      owner: owner,
      repo: name,
      path: "./prisma/schema.prisma",
      ref: branch,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  return response;
}

export async function CreateWebhook(repoUrl: string) {
  const parsedUrl = gitUrlParse(repoUrl);
  const { owner, name } = parsedUrl;

  const octokit = await GetOctokitInstallation(owner, name);

  try {
    const response = await octokit.request(
      `POST /repos/${owner}/${name}/hooks`,
      {
        owner: owner,
        repo: name,
        name: "web",
        active: true,
        events: ["push", "pull_request"],
        config: {
          // to be replaced with actual webhook URL
          url: `${process.env.NEXTAUTH_URL}/api/trpc/receive`,
          content_type: "json",
          insecure_ssl: "1",
        },
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    // Assuming successful creation of webhook
    console.log(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Failed to create webhook: ${error}`);
  }
}
