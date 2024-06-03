import React from "react";
import Link from "next/link";
import Image from "next/image";
import GenerateLogo from "src/app/images/Screenshot 2024-06-03 at 2.19.12 AM.png";

const Home: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-blue-950 to-blue-900 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Image
            src={GenerateLogo}
            alt="Logo"
            width={64}
            height={64}
            className="h-16 mr-4"
          />
          <h1 className="text-4xl font-bold">
            <span className="text-white">Generate</span>{" "}
            <span className="text-yellow-500">DevDB</span>
          </h1>
        </div>
        <div className="space-y-4">
          <div className="flex space-x-4 justify-center">
            <Link href="/request-access" passHref>
              <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">
                Request Access
              </button>
            </Link>
            <Link href="/github-repo" passHref>
              <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">
                View GitHub Repo
              </button>
            </Link>
          </div>
          <Link href="/signin" passHref>
            <button className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-600 mt-4">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
