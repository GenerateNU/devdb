import React from "react";
import Link from "next/link";
import Image from "next/image";
import GenerateLogo from "../../../public/images/SoftwareLight.svg";
import Button from "./Button";

const SignInScreen: React.FC = () => {
  return (
    <div className=" bg-gradient-to-b from-generate-dark to-black from-33 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="flex flex-col gap-24">
          <div className="flex items-center justify-center gap-12">
            <Image
              src={GenerateLogo as string}
              alt="Logo"
              width={128}
              height={128}
            />
            <h1 className=" text-8xl font-bold">
              <span className="text-white">Generate</span>{" "}
              <span className="text-generate-sw">DevDB</span>
            </h1>
          </div>
          <div className="flex flex-row gap-24 justify-center">
            <Button href="/request-access" text="Request Access ->" />
            <Button href="/github-repo" text="View GitHub Repo ->" />
          </div>
          <Button href="/api/auth/signin" text="Sign In" yellow />
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
