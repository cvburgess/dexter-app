// import { formatDate } from '@fullcalendar/core'
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

import { usePreferences } from "../hooks/usePreferences";

export const Calendar = () => {
  const [preferences] = usePreferences();

  if (!preferences.enableCalendar) return null;

  return <CalendarTimeLine calendarUrl={preferences.calendarUrls[0]} />;
};

const now = new Date();

const CalendarTimeLine = ({ calendarUrl }: { calendarUrl: string }) => (
  <FullCalendar
    dayHeaders={false}
    dayMaxEvents={true}
    // dayMinWidth={600}
    editable={false}
    events={{ url: calendarUrl, format: "ics" }}
    headerToolbar={false}
    initialView="timeGridDay"
    nowIndicator
    plugins={[timeGridPlugin]}
    scrollTime={now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}
    selectMirror={true}
    selectable={true}
  />
);
