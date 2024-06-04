"use clien";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Dashboard to ensure it's treated as a Client Component
const Dashboard = dynamic(() => import("../dashboard/page"), { ssr: false });

const DashboardState: React.FC = () => {
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
    <Dashboard
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      openProject={openProject}
      handleToggle={handleToggle}
      filteredProjects={filteredProjects}
    />
  );
};

export default DashboardState;
