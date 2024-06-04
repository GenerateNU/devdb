import React from "react";

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
    <div className="bg-white text-black rounded-xl shadow-md mb-4">
      <div
        className={`p-4 flex justify-between items-center ${isOpen ? "bg-yellow-500" : ""}`}
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
          <span>
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
        <div className="p-4 bg-gray-100 rounded-b-xl">
          <div className="space-y-2">
            {branches.map((branch, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>
                  {branch.name} / {branch.status}
                </span>
                <span>
                  {branch.status} /{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    {branch.actionLabel}
                  </a>
                </span>
                <button>
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={`M${branch.action}`}
                    />
                  </svg>
                </button>
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
            ))}
          </div>
          <div className="mt-4">
            <p>Created by: {creator}</p>
            <p>Created on: {createdOn}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
