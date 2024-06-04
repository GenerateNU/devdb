"use clien";

import React from "react";
import ProjectCard from "../_components/projectcard";

interface ProjectListProps {
  projects: Array<{
    projectName: string;
    route: string;
    branchesCount: number;
    databasesCount: number;
    branches: Array<{
      name: string;
      status: string;
      action: string;
      actionLabel: string;
    }>;
    creator: string;
    createdOn: string;
  }>;
  openProject: number | null;
  handleToggle: (index: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  openProject,
  handleToggle,
}) => {
  return (
    <div className="w-full">
      {projects.map((project, index) => (
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
  );
};

export default ProjectList;
