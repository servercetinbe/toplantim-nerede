import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { saveReservationToDB  } from '../../../lib/mongo';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }
    
    const reservationData = await request.json();

    const reservation = {
      userId: userId,
      date: new Date(reservationData.startTime),
      time: `${reservationData.startTime.split('T')[1]}-${reservationData.endTime.split('T')[1]}`,
      roomId: reservationData.roomId,
    };

    await saveReservationToDB (reservation);
    
    return NextResponse.json({ message: 'Reservation successful' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to make reservation' }, { status: 500 });
  }
}