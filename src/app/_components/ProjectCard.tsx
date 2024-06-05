import React from "react";
import BranchRow from "./BranchRow";

interface Branch {
  name: string;
  status: string;
  action: string;
  actionLabel: string;
}

interface ProjectCardProps {
  projectName: string;
  route: string;
  branchesCount: number;
  databasesCount: number;
  branches: Branch[];
  creator: string;
  createdOn: string;
  isOpen: boolean;
  onToggle: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName,
  route,
  branchesCount,
  databasesCount,
  branches,
  creator,
  createdOn,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="bg-white text-black shadow-md mb-4">
      <div
        className={`p-4 flex justify-between items-center drop-shadow ${isOpen ? " bg-generate-sw" : ""}`}
        onClick={onToggle}
      >
        <div className="flex items-center">
          <button className="mr-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={`M${isOpen ? "5 15l7-7 7 7" : "19 9l-7 7-7-7"}`}
              />
            </svg>
          </button>
          <span className=" select-none">
            {projectName} / {route} - {branchesCount} branches -{" "}
            {databasesCount} databases
          </span>
        </div>
        <button>
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="bg-gray-100 rounded-b-xl">
          <div className="bg-project-row">
            {branches.map((branch, index) => (
              <BranchRow
                key={index}
                name={branch.name}
                status={branch.status}
                action={branch.action}
                actionLabel={branch.actionLabel}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3 py-3 px-12 shadow-inner">
            <p>Created by: {creator}</p>
            <p>Created on: {createdOn}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
