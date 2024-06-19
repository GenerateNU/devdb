import inquirer from "inquirer";
import GetProjects from "../endpoints/getProjects";
import type { Project } from "../types";

type ProjectAnswers = {
  selectedProject: string;
};

const addProjectLabel = "Add a new project";

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
  selectedOption: string;
};

async function SelectProjectOption(
  validOptions: string[],
): Promise<ProjectOptionsAnswers> {
  return (await inquirer.prompt([
    {
      type: "list",
      name: "selectedProject",
      message: "Select a project",
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

async function ViewProjectOptions(project: Project) {
  console.log(project);
  const { status } = project;

  const validOptions =
    status === "available"
      ? ["stop", "delete", "back"]
      : ["start", "delete", "back"];

  const { selectedOption } = await SelectProjectOption(validOptions);

  switch (selectedOption) {
    case "start":
      break;
    case "stop":
      break;
    case "create":
      break;
    case "delete":
      break;
    case "endpoint":
      break;
    case "back":
      // Do nothing
      break;
  }

  await ViewProjects();
}
