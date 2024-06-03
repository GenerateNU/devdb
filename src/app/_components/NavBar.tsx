import React from "react";
import Link from "next/link";
import Image from "next/image";
import GenerateLogo from "../images/Screenshot 2024-06-03 at 2.19.12 AM.png"; // Adjust the path as necessary

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Image src={GenerateLogo} alt="Logo" width={40} height={40} />
        <h1 className="text-xl font-bold ml-2">DevDB</h1>
      </div>
      <div className="flex space-x-4">
        <Link href="/">
          <button className="hover:underline">Home</button>
        </Link>
        <Link href="/new-project">
          <button className="hover:underline">New Project</button>
        </Link>
        <Link href="/sign-out">
          <button className="hover:underline">Sign Out</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
