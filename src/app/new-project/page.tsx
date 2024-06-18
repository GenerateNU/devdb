"use client";

import React, { useState } from "react";
import Navbar from "../_components/NavBar";
import { api } from "~/trpc/react";
import { DBProvider } from "~/server/external/aws.types";

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const createProjectMutation = api.database.create.useMutation({
    onSuccess: () => {
      setFeedbackMessage("Project created successfully!");
    },
    onError: () => {
      setFeedbackMessage("Failed to create project.");
    },
  });

  const handleCreateProject = () => {
    // Handle project creation logic here
    console.log("Creating project:", projectName);
    setFeedbackMessage("Creating project....");
    createProjectMutation.mutate({
      repoUrl: projectName,
      provider: DBProvider.PostgreSQL,
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen py-40  bg-gradient-to-b from-generate-dark to-black text-white">
        <h1 className="text-4xl mb-12 ">Create New Project</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter repository URL"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="px-12 py-3 bg-white text-gray-900 text-black placeholder:text-input-text"
          />
          <button
            onClick={handleCreateProject}
            className=" bg-generate-sw text-black font-bold py-3 px-12 hover:bg-white"
          >
            Create Project
          </button>
        </div>
        {feedbackMessage && (
          <div className="mt-4 text-lg text-center">{feedbackMessage}</div>
        )}
      </div>
    </>
  );
};

export default CreateProject;
