import { DayPicker } from "react-day-picker";
import classNames from "classnames";

export type TOption = {
  emoji: string;
  id: string | null;
  isSelected: boolean;
  title: string;
};

type TButtonWithPopoverProps = {
  buttonClassName?: string;
  children: React.ReactNode;
  onChange: (id: string | null) => void;
  options?: TOption[];
  selectedDate?: string | null;
  variant: "menu" | "calendar";
  wrapperClassName?: string;
};

export const ButtonWithPopover = ({
  buttonClassName,
  children,
  onChange,
  options = [],
  selectedDate = null,
  variant,
  wrapperClassName,
}: TButtonWithPopoverProps) => (
  <div
    className={classNames(
      "dropdown dropdown-start dropdown-hover",
      wrapperClassName,
    )}
  >
    <div
      tabIndex={0}
      role="button"
      className={classNames(
        "w-5 h-5 rounded-box outline focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-xs outline-current/40 hover:bg-current/10",
        buttonClassName,
      )}
    >
      {children}
    </div>
    {variant === "menu"
      ? <DropdownMenu onChange={onChange} options={options} />
      : <Calendar onChange={onChange} selectedDate={selectedDate} />}
  </div>
);

type TDropdownMenuProps = {
  onChange: (id: string | null) => void;
  options: TOption[];
};

const popoverStyles =
  "dropdown-content bg-base-100 rounded-box shadow-sm text-base-content";

const DropdownMenu = ({ onChange, options }: TDropdownMenuProps) => (
  <ul
    className={classNames(popoverStyles, "menu p-2 min-w-52")}
    tabIndex={0}
  >
    {options.map((option) => (
      <li key={option.id}>
        <a
          onClick={() => onChange(option.id)}
          className={classNames("flex items-center gap-2", {
            "bg-base-300": option.isSelected,
          })}
        >
          <span>{option.emoji}</span>
          <span>{option.title}</span>
        </a>
      </li>
    ))}
  </ul>
);

type TCalendarProps = {
  onChange: (date: string | null) => void;
  selectedDate: string | null;
};

const Calendar = ({ onChange, selectedDate }: TCalendarProps) => (
  <div
    className={classNames(popoverStyles)}
    tabIndex={0}
  >
    <DayPicker
      className="react-day-picker flex"
      classNames={{
        today: "bg-base-content text-base-100 rounded-field",
        selected: "bg-base-300 text-base-content rounded-field",
      }}
      mode="single"
      onSelect={(date) => onChange(date?.toISOString()?.split("T")[0] ?? null)}
      selected={toDateTime(selectedDate)}
      showOutsideDays
      weekStartsOn={1}
    />
  </div>
);

// Helper function to correctly parse YYYY-MM-DD without timezone issues
const toDateTime = (date: string | null) => {
  if (!date) return undefined;

  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};
