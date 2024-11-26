"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { getReservationsFromStorage } from "@/utils/reservationStorage";
import { useUser } from "@clerk/nextjs";

import { CalendarEvent } from "../types/CalendarEvent";

const localizer = momentLocalizer(moment);

const UserCalendar = (): React.ReactElement => {
  const { user, isSignedIn } = useUser();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<"month" | "week" | "work_week" | "day" | "agenda">("month");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (isSignedIn && user) {
      const reservations = getReservationsFromStorage();
      const userReservations = reservations.filter(reservation => reservation.user?.id === user.id);

      const formattedEvents = userReservations.map(reservation => ({
        id: reservation.id,
        title: reservation.room?.name || "Toplantı",
        start: new Date(reservation.startTime),
        end: new Date(reservation.endTime),
        isAvailable: false,
      }));

      setEvents(formattedEvents);
    }
  }, [isSignedIn, user]);

  return (
    <div style={{ height: "calc(100vh - 100px)" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        view={view}
        date={date}
        onView={newView => setView(newView)}
        onNavigate={newDate => setDate(newDate)}
        messages={{
          next: "Sonraki",
          previous: "Önceki",
          today: "Bugün",
          [Views.MONTH]: "Ay",
          [Views.WEEK]: "Hafta",
          [Views.DAY]: "Gün",
          [Views.AGENDA]: "Ajanda",
        }}
        eventPropGetter={event => ({
          style: {
            backgroundColor: event.isAvailable ? "#28a745" : "#4338CA",
            color: "white",
            borderRadius: "8px",
            padding: "4px",
          },
        })}
      />
    </div>
  );
};

export default UserCalendar;
