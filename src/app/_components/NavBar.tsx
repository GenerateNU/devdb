import React from "react";
import Link from "next/link";
import Image from "next/image";
import GenerateLogo from "../../../public/images/SoftwareLight.svg";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-generate-dark text-white p-4 flex justify-between items-center">
      <Link href="/">
        <div className="flex items-center gap-4">
          <Image
            src={GenerateLogo as string}
            alt="Logo"
            width={40}
            height={40}
          />
          <h1 className="text-xl font-bold">DevDB</h1>
        </div>
      </Link>
      <div className="flex gap-2 sm:gap-6">
        <Link href="/">
          <button className="hover:underline font-bold">Home</button>
        </Link>
        <Link href="/cli">
          <button className="hover:underline font-bold">CLI</button>
        </Link>
        <Link href="/new-project">
          <button className="hover:underline">New Project</button>
        </Link>
        <Link href="/api/auth/signout">
          <button className="hover:underline">Sign Out</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
