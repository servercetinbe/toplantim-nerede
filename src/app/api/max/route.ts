import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest): Promise<Response> => {
  const body = await request.json();
  const { arr } = body;

  if (!arr || !Array.isArray(arr)) {
    return NextResponse.json(
      {
        data: null,
        error: { message: "Array of numbers is required" },
        message: "Error: Invalid input",
      },
      { status: 400 }
    );
  }

  const maxSubarray = (arr: number[]) => {
    let [currSum, maxSum] = [arr[0], arr[0]];

    for (let i = 1; i < arr.length; i += 1) {
      currSum = Math.max(arr[i], currSum + arr[i]);
      maxSum = Math.max(maxSum, currSum);
    }

    return maxSum;
  };

  const result = maxSubarray(arr);

  return NextResponse.json({
    data: result,
    error: null,
    message: "Max subarray sum calculated successfully",
  });
};
