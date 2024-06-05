"use client";

import { useState } from "react";
import ProjectList from "./ProjectList";
import SearchInput from "./SearchInput";

export default function DashboardItems() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openProject, setOpenProject] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenProject(openProject === index ? null : index);
  };

  const projects = [
    {
      projectName: "natesawant",
      route: "website",
      branchesCount: 1,
      databasesCount: 0,
      branches: [
        {
          name: "main",
          status: "Running",
          action: "M10 9v6m4-6v6",
          actionLabel: "Connect to Database",
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
      branches: [
        {
          name: "main",
          status: "Running",
          action: "M10 9v6m4-6v6",
          actionLabel: "Connect to Database",
        },
        {
          name: "stopped-example",
          status: "Stopped",
          action: "M14.752 11.168l-6.048 3.684",
          actionLabel: "Connect to Database",
        },
        {
          name: "no-database-example",
          status: "No DB",
          action: "M12 4v16m8-8H4",
          actionLabel: "Create Database",
        },
      ],
      creator: "Nate Sawant",
      createdOn: "May 27, 2024",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ProjectList
        projects={projects}
        openProject={openProject}
        handleToggle={handleToggle}
      />
    </div>
  );
}
