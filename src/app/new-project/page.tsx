"use client";

import React, { useState } from "react";
import Navbar from "../_components/NavBar";

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState("");

  const handleCreateProject = () => {
    // Handle project creation logic here
    console.log("Creating project:", projectName);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen py-40  bg-gradient-to-b from-generate-dark to-black text-white">
        <h1 className="text-6xl mb-12 ">Create New Project</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="px-12 py-3 rounded bg-white text-gray-900"
          />
          <button
            onClick={handleCreateProject}
            className=" bg-generate-sw text-black font-bold py-3 px-12 rounded hover:bg-yellow-600"
          >
            Create Project
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
