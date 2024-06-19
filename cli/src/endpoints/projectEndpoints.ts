import type { Project } from "../types";
import { axiosInstance, config } from "./authAxios";

export async function GetProjects(): Promise<Project[]> {
  const fullUrl = `${config.baseUrl}/api/trpc/database.get?input=${encodeURIComponent(JSON.stringify({ json: { searchTerms: "" } }))}`;

  const response = await axiosInstance.get(fullUrl);

  const { result } = response.data as { result: { data: { json: Project[] } } };

  const projects = result.data.json;

  return projects;
}

export async function CreateProject(repoUrl: string): Promise<boolean> {
  const { status } = await axiosInstance.post(
    `${config.baseUrl}/api/trpc/database.create`,
    {
      json: {
        repoUrl: repoUrl,
        provider: "postgres",
      },
    },
  );

  return status === 200;
}

export async function DeleteProject(repoUrl: string): Promise<boolean> {
  const { status } = await axiosInstance.post(
    `${config.baseUrl}/api/trpc/database.delete`,
    {
      json: {
        repoUrl: repoUrl,
      },
    },
  );

  return status === 200;
}

export async function StartProject(repoUrl: string): Promise<boolean> {
  const { status } = await axiosInstance.post(
    `${config.baseUrl}/api/trpc/database.start`,
    {
      json: {
        repoUrl: repoUrl,
      },
    },
  );

  return status === 200;
}

export async function StopProject(repoUrl: string): Promise<boolean> {
  const { status } = await axiosInstance.post(
    `${config.baseUrl}/api/trpc/database.stop`,
    {
      json: {
        repoUrl: repoUrl,
      },
    },
  );

  return status === 200;
}

export async function GetEndpoint(
  repoUrl: string,
): Promise<string | undefined> {
  const response = await axiosInstance.post(
    `${config.baseUrl}/api/trpc/database.endpoint`,
    {
      json: {
        repoUrl: repoUrl,
      },
    },
  );

  const { status } = response;

  const { result } = response.data as { result: { data: { json: string } } };

  if (status === 200) {
    return result.data.json;
  }

  return;
}
