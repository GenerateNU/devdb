"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import ProjectList from "./ProjectList";
import SearchInput from "./SearchInput";

export default function DashboardItems() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openProject, setOpenProject] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenProject(openProject === index ? null : index);
  };

  //const deleteProjectMutation = api.database.create.useMutation()

  const projects = [
    {
      projectName: "natesawant",
      route: "website",
      branchesCount: 1,
      databasesCount: 0,
      instanceStatus: "Running",
      branches: [
        {
          creator: "natesawant",
          name: "main",
          status: "Running",
        },
      ],
      creator: "Nate Sawant",
      createdOn: "May 27, 2024",
    },
    {
      projectName: "Generate",
      route: "routes",
      branchesCount: 3,
      databasesCount: 2,
      instanceStatus: "Stopped",
      branches: [
        {
          creator: "natesawant",
          name: "main",
          status: "Running",
        },
        {
          creator: "diffuser",
          name: "stopped-example",
          status: "Stopped",
        },
        {
          creator: "natesawant",
          name: "no-database-example",
          status: "No DB",
        },
      ],
      creator: "Nate Sawant",
      createdOn: "May 27, 2024",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ProjectList
        projects={projects}
        openProject={openProject}
        handleToggle={handleToggle}
      />
    </div>
  );
}
