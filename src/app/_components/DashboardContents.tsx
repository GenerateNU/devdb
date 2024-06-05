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

  const getProjectsQuery = api.database.get.useQuery({
    searchTerms: searchTerm,
  });

  const mappedProjects = getProjectsQuery.data?.map((project) => {
    return {
      projectName: project.repository,
      route: project.repository,
      branchesCount: project.branches.length,
      databasesCount: project.branches.length,
      instanceStatus: "TODO",
      branches: project.branches.map((branch) => {
        return {
          creator: branch.createdBy.name ?? "Unknown",
          name: branch.name,
          status: "TODO: REMOVE",
        };
      }),
      creator: project.createdBy.name ?? "Unknown",
      createdOn: project.createdAt,
    };
  });

  console.log(mappedProjects);

  return (
    <div className="flex flex-col gap-8">
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {mappedProjects && (
        <ProjectList
          projects={mappedProjects}
          openProject={openProject}
          handleToggle={handleToggle}
        />
      )}
    </div>
  );
}
