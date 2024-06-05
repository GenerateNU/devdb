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
      projectName: project.repo,
      route: project.repo,
      branchesCount: project.instances.length,
      databasesCount: project.instances.length,
      instanceStatus: "TODO",
      branches: project.instances.map((branch) => {
        return {
          creator: "TODO",
          name: branch.branch,
          status: "TODO: REMOVE",
        };
      }),
      creator: "TODO",
      createdOn: "TODO",
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
