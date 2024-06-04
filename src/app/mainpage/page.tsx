import React from "react";
import Link from "next/link";
import Image from "next/image";
import GenerateLogo from "../../../public/images/generatelogo.png";

const Home: React.FC = () => {
  return (
    <div className=" bg-gradient-to-b from-generate-dark to-black from-33 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Image
            src={GenerateLogo}
            alt="Logo"
            width={64}
            height={64}
            className="h-16 mr-4"
          />
          <h1 className=" text-8xl font-bold py-2">
            <span className="text-white">Generate</span>{" "}
            <span className="text-generate-sw">DevDB</span>
          </h1>
        </div>
        <div className="space-y-24">
          <div className="flex space-x-24 mt-24 justify-center">
            <Link href="/request-access" passHref>
              <button className="bg-white text-black py-3 px-12 gap-2.5 hover:bg-blue-600">
                Request Access {"->"}
              </button>
            </Link>
            <Link href="/github-repo" passHref>
              <button className="bg-white text-black py-3 px-12  hover:bg-blue-600">
                View GitHub Repo
              </button>
            </Link>
          </div>
          <Link href="/signin" passHref>
            <button className="bg-generate-sw text-black font-semibold py-3 px-12 hover:bg-yellow-600 mt-24">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
