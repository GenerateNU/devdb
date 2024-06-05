import React from "react";
import Navbar from "./NavBar";
import DashboardItems from "./DashboardContents";

const Dashboard: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen min-x-screen">
        <div className="px-24 py-12 min-x-screen min-h-screen bg-gradient-to-b from-generate-dark to-black from-33 text-white">
          <DashboardItems />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
