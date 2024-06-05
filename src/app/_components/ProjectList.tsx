import React from "react";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  projects: Array<{
    projectName: string;
    route: string;
    branchesCount: number;
    databasesCount: number;
    instanceStatus: string;
    branches: Array<{
      creator: string;
      name: string;
      status: string;
    }>;
    creator: string;
    createdOn: Date;
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
    <div className="w-full flex flex-col gap-8">
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          projectName={project.projectName}
          route={project.route}
          branchesCount={project.branchesCount}
          databasesCount={project.databasesCount}
          instanceStatus={project.instanceStatus}
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
