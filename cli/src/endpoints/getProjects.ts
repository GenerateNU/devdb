import type { Project } from "../types";
import { axiosInstance, config } from "./authAxios";

export default async function GetProjects() {
  const fullUrl = `${config.baseUrl}/api/trpc/database.get?input=${encodeURIComponent(JSON.stringify({ json: { searchTerms: "" } }))}`;

  const response = await axiosInstance.get(fullUrl);

  const { result } = response.data as { result: { data: { json: Project[] } } };

  const projects = result.data.json;

  return projects;
}
