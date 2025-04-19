import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import iCalendarPlugin from "@fullcalendar/icalendar";

import { usePreferences } from "../hooks/usePreferences";

const PROXY_URL = "https://api.dexterplanner.com/functions/v1/ics-proxy";

export const Calendar = () => {
  const [preferences] = usePreferences();

  if (!preferences.enableCalendar) return null;

  return (
    <CalendarTimeLine
      calendarUrls={preferences.calendarUrls}
      endTime={preferences.calendarEndTime}
      startTime={preferences.calendarStartTime}
    />
  );
};

const now = new Date();

type TCalendarTimeLineProps = {
  calendarUrls: string[];
  endTime: string;
  startTime: string;
};

const CalendarTimeLine = ({
  calendarUrls,
  endTime,
  startTime,
}: TCalendarTimeLineProps) => (
  <FullCalendar
    dayHeaders={false}
    dayMaxEvents={true}
    // dayMinWidth={600}
    editable={false}
    eventSources={calendarUrls.map((url) => ({
      url: `${PROXY_URL}?url=${url}`,
      format: "ics",
    }))}
    headerToolbar={false}
    initialView="timeGridDay"
    nowIndicator
    plugins={[iCalendarPlugin, timeGridPlugin]}
    scrollTime={now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}
    slotMaxTime={endTime}
    slotMinTime={startTime}
  />
);
