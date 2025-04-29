import { useEffect, useState } from "react";
import { Trash } from "@phosphor-icons/react";

import { ButtonWithPopover } from "../../components/ButtonWithPopover";
import { Card } from "../../components/CardTemplate";
import { ConfirmModal } from "../../components/ConfirmModal";

import { useTemplates } from "../../hooks/useTemplates";

import { TTemplate, TUpdateTemplate } from "../../api/templates";

export const Tasks = () => {
  const [templates, { updateTemplate, deleteTemplate }] = useTemplates();

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend ml-2 text-base">Repeat Tasks</legend>
      <div className="flex flex-col gap-2">
        {templates.map((template) => (
          <div className="flex flex-wrap gap-2" key={template.id}>
            <Card template={template} />
            <CronInput
              deleteTemplate={deleteTemplate}
              template={template}
              updateTemplate={updateTemplate}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
};

type TCronInputProps = {
  deleteTemplate: (id: string) => void;
  template: TTemplate;
  updateTemplate: (template: TUpdateTemplate) => void;
};

type EInterval = "day" | "week" | "month" | "year";

const parseSchedule = (schedule: string) => {
  const [, , daysOfMonth, months, daysOfWeek] = schedule.split(" ");

  let interval: EInterval;

  if (daysOfMonth !== "*") {
    interval = "month";
  } else if (daysOfWeek !== "*") {
    interval = "week";
  } else if (months !== "*") {
    interval = "year";
  } else {
    interval = "day";
  }

  const parseValue = (value: string) => {
    if (value === "*") return [];
    return value.split(",");
  };

  return {
    interval,
    daysOfMonth: parseValue(daysOfMonth),
    months: parseValue(months),
    daysOfWeek: parseValue(daysOfWeek),
  };
};

const serializeSchedule = (
  interval: EInterval,
  daysOfMonth: string[],
  months: string[],
  daysOfWeek: string[],
) => {
  let isValid = false;
  const schedule = ["0", "0"];

  switch (interval) {
    case "day":
      isValid = true;
      schedule.push("*", "*", "*");
      break;
    case "week":
      isValid = daysOfWeek.length > 0;
      schedule.push("*", "*", daysOfWeek.join(","));
      break;
    case "month":
      isValid = daysOfMonth.length > 0;
      schedule.push(daysOfMonth.join(","), "*", "*");
      break;
    case "year":
      isValid = daysOfMonth.length > 0 && months.length > 0;
      schedule.push(daysOfMonth.join(","), months.join(","), "*");
      break;
  }

  return { isValid, schedule: schedule.join(" ") };
};

const CronInput = ({
  deleteTemplate,
  template,
  updateTemplate,
}: TCronInputProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const parsed = parseSchedule(template.schedule);

  const [interval, setInterval] = useState<EInterval>(parsed.interval);
  const [daysOfMonth, setDaysOfMonth] = useState<string[]>(parsed.daysOfMonth);
  const [months, setMonths] = useState<string[]>(parsed.months);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(parsed.daysOfWeek);

  useEffect(() => {
    const { isValid, schedule } = serializeSchedule(
      interval,
      daysOfMonth,
      months,
      daysOfWeek,
    );

    if (isValid) updateTemplate({ id: template.id, schedule });
  }, [interval, daysOfMonth, months, daysOfWeek]);

  return (
    <>
      <div className="join flex-1 min-w-standard min-h-standard h-auto">
        <ButtonWithPopover
          buttonClassName="text-nowrap bg-base-100 font-normal !text-base h-full"
          buttonVariant="join"
          onChange={(interval: EInterval) => setInterval(interval)}
          options={[
            { id: "day", title: "Day", isSelected: interval === "day" },
            { id: "week", title: "Week", isSelected: interval === "week" },
            { id: "month", title: "Month", isSelected: interval === "month" },
            { id: "year", title: "Year", isSelected: interval === "year" },
          ]}
          popoverId={`template-${template.id}-interval`}
          title="Interval"
          variant="menu"
        >
          Repeat every {interval}
        </ButtonWithPopover>

        {interval === "week" && (
          <ButtonWithPopover
            buttonClassName="text-nowrap bg-base-100 -ml-[1px] font-normal !text-base h-full"
            buttonVariant="join"
            onChange={(days: string[]) => setDaysOfWeek(days.sort())}
            options={[
              { id: "1", title: "Monday" },
              { id: "2", title: "Tuesday" },
              { id: "3", title: "Wednesday" },
              { id: "4", title: "Thursday" },
              { id: "5", title: "Friday" },
              { id: "6", title: "Saturday" },
              { id: "7", title: "Sunday" },
            ]}
            popoverId={`template-${template.id}-daysOfWeek`}
            selected={daysOfWeek}
            title="Days of Week"
            variant="multiSelectMenu"
          >
            on{" "}
            {daysOfWeek
              .map(
                (dayOfWeek) =>
                  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                    parseInt(dayOfWeek) - 1
                  ],
              )
              .join(", ")}
          </ButtonWithPopover>
        )}

        {interval === "year" && (
          <ButtonWithPopover
            buttonClassName="text-nowrap bg-base-100 -ml-[1px] font-normal !text-base h-full"
            buttonVariant="join"
            onChange={(selectedMonths: string[]) =>
              setMonths(selectedMonths.sort())
            }
            options={[
              { id: "1", title: "January" },
              { id: "2", title: "February" },
              { id: "3", title: "March" },
              { id: "4", title: "April" },
              { id: "5", title: "May" },
              { id: "6", title: "June" },
              { id: "7", title: "July" },
              { id: "8", title: "August" },
              { id: "9", title: "September" },
              { id: "10", title: "October" },
              { id: "11", title: "November" },
              { id: "12", title: "December" },
            ]}
            popoverId={`template-${template.id}-months`}
            selected={months}
            title="Months"
            variant="multiSelectMenu"
          >
            in{" "}
            {months
              .map(
                (month) =>
                  [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ][parseInt(month) - 1],
              )
              .join(", ")}
          </ButtonWithPopover>
        )}

        {(interval === "month" || interval === "year") && (
          <ButtonWithPopover
            buttonClassName="text-nowrap bg-base-100 -ml-[1px] font-normal !text-base h-full"
            buttonVariant="join"
            onChange={(days: string[]) => setDaysOfMonth(days.sort())}
            options={Array.from({ length: 31 }, (_, i) => ({
              id: `${i + 1}`,
              title: `${i + 1}`,
            }))}
            popoverId={`template-${template.id}-daysOfMonth`}
            selected={daysOfMonth}
            title="Days of Month"
            variant="multiSelectMenu"
          >
            on the {daysOfMonth.join(", ")}
          </ButtonWithPopover>
        )}

        <span
          className="btn join-item h-full bg-base-100 text-base-content/60 hover:text-error"
          onClick={openModal}
        >
          <Trash />
        </span>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        message={
          <>
            Dexter will no longer automatically
            <br /> create tasks based on this schedule
          </>
        }
        onClose={closeModal}
        options={[
          {
            action: () => deleteTemplate(template.id),
            buttonClass: "btn-error",
            title: "Delete",
          },
        ]}
        title={`Delete ${template.title}?`}
      />
    </>
  );
};
