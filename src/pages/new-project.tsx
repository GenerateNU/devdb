import React, { useState } from "react";
import Navbar from "src/app/_components/NavBar";

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState("");

  const handleCreateProject = () => {
    // Handle project creation logic here
    console.log("Creating project:", projectName);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="px-4 py-2 rounded bg-white text-gray-900"
          />
          <button
            onClick={handleCreateProject}
            className="bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-600"
          >
            Create Project
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
