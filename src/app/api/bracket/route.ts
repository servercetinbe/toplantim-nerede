import { NextResponse } from "next/server";

export const GET = async (request: Request): Promise<Response> => {
  const { searchParams } = new URL(request.url);
  const str = searchParams.get("str");

  if (!str) {
    return NextResponse.json(
      {
        data: null,
        error: { message: "String parameter is required" },
        message: "Error: Missing string parameter",
      },
      { status: 400 }
    );
  }

  let count = 0;
  for (const char of str) {
    if (char === "(") count += 1;
    if (char === ")") count -= 1;
    if (count < 0) break;
  }

  const result = count === 0 ? 1 : 0;

  return NextResponse.json({
    data: result,
    error: null,
    message: result === 1 ? "Brackets are correctly matched" : "Brackets are not correctly matched",
  });
};
