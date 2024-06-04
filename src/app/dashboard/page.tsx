"use client";

import React, { useState } from "react";
import Navbar from "../_components/NavBar";
import ProjectCard from "../_components/projectcard";
import SearchInput from "../_components/SearchInput";
import ProjectList from "../_components/ProjectList";

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openProject, setOpenProject] = useState<number | null>(null);

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

  const handleToggle = (index: number) => {
    setOpenProject(openProject === index ? null : index);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.route.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen min-x-screen">
        <div className="px-24 py-12 min-x-screen min-h-screen bg-gradient-to-b from-generate-dark to-black from-33 text-white">
          <div className="flex flex-col gap-4">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <ProjectList
              projects={filteredProjects}
              openProject={openProject}
              handleToggle={handleToggle}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
