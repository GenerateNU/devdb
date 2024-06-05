import React from "react";
import BranchRow from "./BranchRow";
import Link from "next/link";

interface Branch {
  creator: string;
  name: string;
  status: string;
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
    <div className="bg-white text-black shadow-md">
      <div
        className={` pr-8 py-3 flex flex-row justify-between ${isOpen ? "bg-generate-sw" : "bg-white"}`}
      >
        <div className=" flex flex-row items-center">
          <button className=" px-12" onClick={onToggle}>
            <img src="./images/ChevronIcon.svg" className=" w-8" />
          </button>
          <span>
            <Link
              className=" underline"
              rel="noopener noreferrer"
              target="_blank"
              href={"https://github.com/GenerateNU/"}
            >
              {projectName}
            </Link>{" "}
            /{" "}
            <Link
              className=" underline"
              rel="noopener noreferrer"
              target="_blank"
              href={"https://github.com/GenerateNU/devdb"}
            >
              {route}
            </Link>{" "}
            - {branchesCount} branches - {databasesCount} databases
          </span>
        </div>
        <button className=" px-4 ">
          <img src="./images/DeleteIcon.svg" />
        </button>
      </div>
      {isOpen && (
        <div className="bg-gray-100 rounded-b-xl">
          <div className="bg-project-row">
            {branches.map((branch, index) => (
              <BranchRow
                key={index}
                creator={branch.creator}
                name={branch.name}
                status={branch.status}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3 py-3 px-12 shadow-inner bg-white">
            <p>Created by: {creator}</p>
            <p>Created on: {createdOn}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
