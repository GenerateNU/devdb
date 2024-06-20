"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Dummy() {
  const [results, setResults] = useState("");
  const testDummy = api.dummy.testDummy.useMutation();

  const handleCreateDummyData = () => {
    testDummy
      .mutateAsync({ name: "test" })
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .then((data) => setResults(`success: ${data.message}`))
      .catch((error) => console.error(error));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <button onClick={handleCreateDummyData}>Create Data</button>
      <div>{results}</div>
    </main>
  );
}
