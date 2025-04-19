import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import iCalendarPlugin from "@fullcalendar/icalendar";
import { Temporal } from "@js-temporal/polyfill";

import { usePreferences } from "../hooks/usePreferences";

const PROXY_URL = "https://api.dexterplanner.com/functions/v1/ics-proxy";

type TCalendarProps = {
  date: Temporal.PlainDate;
};

export const Calendar = ({ date }: TCalendarProps) => {
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
};

const now = new Date();

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
    initialDate={date}
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
