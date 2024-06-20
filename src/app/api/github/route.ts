import { NextResponse, type NextRequest } from "next/server";
import { PushSchemaFromBranch } from "../../../server/prisma/schema";

// To handle a POST request to /api/github
export async function POST(request: NextRequest) {
  const { ref, repository } = (await request.json()) as {
    ref: string;
    repository: { owner: string; name: string };
  };

  try {
    const branch = ref.split("/")[-1];
    const { owner, name } = repository;
    if (branch) {
      await PushSchemaFromBranch(
        `https://github.com/${owner}/${name}`,
        branch,
        owner,
        name,
      );
      return NextResponse.json({ status: 200 });
    } else {
      return NextResponse.json({ status: 500 });
    }
  } catch {
    return NextResponse.json({ status: 500 });
  }
}
