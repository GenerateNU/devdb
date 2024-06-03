import React, { useState } from "react";
import Navbar from "src/app/_components/NavBar";
import ProjectCard from "src/app/_components/projectcard";

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
      <div className=" min-h-screen min-x-screen">
        <div className="flex flex-col items-center justify-center min-x-screen min-h-screen bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search projects or databases"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded bg-white text-gray-700 placeholder-gray-500"
            />
          </div>
          <div className="w-full">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={index}
                projectName={project.projectName}
                route={project.route}
                branchesCount={project.branchesCount}
                databasesCount={project.databasesCount}
                branches={project.branches}
                creator={project.creator}
                createdOn={project.createdOn}
                isOpen={openProject === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
