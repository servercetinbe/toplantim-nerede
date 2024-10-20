import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rooms = [
      { id: 'puzzleA', name: 'Puzzle A', capacity: 10 },
      { id: 'passengerA', name: 'Passenger A', capacity: 15 },
      { id: 'passengerB', name: 'Passenger B', capacity: 12 },
    ];

    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}