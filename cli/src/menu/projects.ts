import inquirer from "inquirer";
import {
  CreateProject,
  DeleteProject,
  GetEndpoint,
  GetProjects,
  StartProject,
  StopProject,
} from "../endpoints/projectEndpoints";
import type { Project } from "../types";
import updateExistingEnvVariable from "../utils/updateEnv";
import parse from "parse-git-config";

type ProjectAnswers = {
  selectedProject: string;
};

const addProjectLabel = "Add current repo as project";

async function SelectProject(projectNames: string[]): Promise<ProjectAnswers> {
  return (await inquirer.prompt([
    {
      type: "list",
      name: "selectedProject",
      message: "Select a project",
      choices: [addProjectLabel].concat(projectNames).concat(["back"]),
    },
  ])) as ProjectAnswers;
}

type ProjectOptionsAnswers = {
  selectedOption: "start" | "stop" | "create" | "delete" | "endpoint" | "back";
};

async function SelectProjectOption(
  validOptions: string[],
): Promise<ProjectOptionsAnswers> {
  return (await inquirer.prompt([
    {
      type: "list",
      name: "selectedOption",
      message: "Select an option",
      choices: validOptions,
    },
  ])) as ProjectOptionsAnswers;
}

export default async function ViewProjects() {
  const projects = await GetProjects();

  const { selectedProject: selectedProjectName } = await SelectProject(
    projects.map((proj) => proj.repository),
  );

  if (selectedProjectName === addProjectLabel) {
    const gitConfig = parse.expandKeys(parse.sync());

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const url = gitConfig?.remote?.origin?.url as string;

    if (url) {
      const createSuccess = await CreateProject(url);
      LogSuccess(createSuccess, "created", "creating");
    } else {
      console.log("❌ This project does not have a git repo initialized");
    }
  } else if (selectedProjectName === "back") {
    // Do nothing
  } else {
    const selectedProject =
      projects[
        projects.findIndex((proj) => proj.repository === selectedProjectName)
      ];

    if (selectedProject) await ViewProjectOptions(selectedProject);
  }
}

function LogSuccess(success: boolean, pastTense: string, presentTense: string) {
  console.log(
    success
      ? `✅ Successfully ${pastTense} project`
      : `❌ Failed ${presentTense} project`,
  );
}

async function ViewProjectOptions(project: Project) {
  console.log(project);
  const { status, repository } = project;

  const validOptions =
    status === "available"
      ? ["stop", "endpoint", "delete", "back"]
      : ["start", "endpoint", "delete", "back"];

  const { selectedOption } = await SelectProjectOption(validOptions);

  console.log(`selected option: ${selectedOption}`);

  switch (selectedOption) {
    case "start":
      const startSuccess = await StartProject(repository);
      LogSuccess(startSuccess, "started", "starting");
      break;
    case "stop":
      const stopSuccess = await StopProject(repository);
      LogSuccess(stopSuccess, "stopped", "stopping");
      break;
    case "create":
      const createSuccess = await CreateProject(repository);
      LogSuccess(createSuccess, "created", "creating");
      break;
    case "delete":
      const deleteSuccess = await DeleteProject(repository);
      LogSuccess(deleteSuccess, "deleted", "deleting");
      break;
    case "endpoint":
      const endpoint = await GetEndpoint(repository);
      if (endpoint) {
        await updateExistingEnvVariable("DATABASE_URL", endpoint);
      }
      LogSuccess(endpoint !== undefined, "set", "setting");
      break;
    case "back":
      // Do nothing
      break;
  }

  await ViewProjects();
}
