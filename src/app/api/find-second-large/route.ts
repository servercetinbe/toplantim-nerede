import { NextResponse } from "next/server";
import { z } from "zod";

const result = z.object({
  data: z.array(
    z.number({
      invalid_type_error: "Her eleman bir sayı olmalıdır.",
    })
  ).min(2, "Dizi en az iki sayı içermelidir."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = result.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: validation.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { data } = validation.data;

    const findSecondLargest = (arr: number[]) => {
      let first = 0;
      let second = 0;

      for (const num of arr) {
        if (num > first) {
          second = first;
          first = num;
        } else if (num > second && num !== first) {
          second = num;
        }
      }

      return second === 0 ? null : second;
    };

    const secondLargest = findSecondLargest(data);

    if (secondLargest === null) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "İkinci en büyük sayı bulunamadı.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: secondLargest,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
