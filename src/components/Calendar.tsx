import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import iCalendarPlugin from "@fullcalendar/icalendar";
import { Temporal } from "@js-temporal/polyfill";

import { usePreferences } from "../hooks/usePreferences";

const PROXY_URL = "https://api.dexterplanner.com/functions/v1/ics-proxy";

type TCalendarProps = {
  date: Temporal.PlainDate;
};

export const Calendar = React.memo(({ date }: TCalendarProps) => {
  const [preferences] = usePreferences();

  if (!preferences.enableCalendar) return null;

  return (
    <div className="flex flex-1 w-standard my-4 border-2 border-base-200 rounded-box">
      <CalendarTimeLine
        calendarUrls={preferences.calendarUrls}
        date={date.toString()}
        endTime={preferences.calendarEndTime}
        key={date.toString()}
        startTime={preferences.calendarStartTime}
      />
    </div>
  );
});

Calendar.displayName = "Calendar";

type TCalendarTimeLineProps = {
  calendarUrls: string[];
  date: string;
  endTime: string;
  startTime: string;
};

const CalendarTimeLine = ({
  calendarUrls,
  date,
  endTime,
  startTime,
}: TCalendarTimeLineProps) => {
  const now = new Date();

  const currentTime = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const sources = calendarUrls.map((url) => ({
    url: `${PROXY_URL}?url=${url}`,
    format: "ics",
  }));

  return (
    <FullCalendar
      dayHeaders={false}
      dayMaxEvents={true}
      editable={false}
      eventSources={sources}
      headerToolbar={false}
      initialDate={date}
      initialView="timeGridDay"
      nowIndicator
      plugins={[iCalendarPlugin, timeGridPlugin]}
      scrollTime={currentTime}
      slotMaxTime={endTime}
      slotMinTime={startTime}
    />
  );
};
