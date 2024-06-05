"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import ProjectList from "./ProjectList";
import SearchInput from "./SearchInput";
import Link from "next/link";

export default function DashboardItems() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openProject, setOpenProject] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenProject(openProject === index ? null : index);
  };

  const {
    data: projectsData,
    error,
    isLoading,
  } = api.database.get.useQuery({
    searchTerms: searchTerm,
  });

  const mappedProjects = projectsData?.map((project) => {
    console.log(project.rdsInstanceId);
    //const { status } = api.database.status.useQuery({ rdsInstanceId: project.rdsInstanceId })

    return {
      projectName: project.repository,
      route: project.repository,
      branchesCount: project.branches.length,
      databasesCount: project.branches.length,
      instanceStatus: "Unknown",
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
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!isLoading &&
        !error &&
        (!mappedProjects || mappedProjects.length === 0) && (
          <div className="text-center py-24 text-3xl">
            No available projects.{" "}
            <Link className=" underline" href={"new-project"}>
              Create a new project?
            </Link>
          </div>
        )}
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
