import { App } from "octokit";
import gitUrlParse from "git-url-parse";
import { type BranchInformation } from "./github.types";

const APP = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

async function GetOctokit(owner: string, name: string) {
  const response = await APP.octokit.request(
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

  return await APP.getInstallationOctokit(installationId);
}

export async function CreateWebhook(repoUrl: string): Promise<boolean> {
  const parsedUrl = gitUrlParse(repoUrl);
  const { owner, name } = parsedUrl;

  const octokit = await GetOctokit(owner, name);

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
    return true;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return false;
  }
}

export async function FetchBranches(repoUrl: string): Promise<string[]> {
  const parsedUrl = gitUrlParse(repoUrl);
  const { owner, name } = parsedUrl;

  const octokit = await GetOctokit(owner, name);

  const response = await octokit.request(
    `GET /repos/${owner}/${name}/branches`,
    {
      owner: "OWNER",
      repo: "REPO",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  const dataArray = response.data as BranchInformation[];

  const branches = dataArray.map((item) => item.name);

  return branches;
}
