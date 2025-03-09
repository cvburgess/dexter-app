import { DayPicker } from "react-day-picker";
import classNames from "classnames";

type TOption = {
  id: string | null;
  title: string;
  emoji: string;
  isSelected: boolean;
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
      // popoverTarget={variant === "calendar" ? "rdp-popover" : undefined}
      // style={variant === "calendar"
      //   ? { anchorName: "--rdp" } as React.CSSProperties
      //   : undefined}
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
    className={classNames(popoverStyles, "")}
    tabIndex={0}
    // id="rdp-popover"
    // style={{ positionAnchor: "--rdp" } as React.CSSProperties}
  >
    <DayPicker
      className="react-day-picker flex"
      mode="single"
      selected={selectedDate ? new Date(selectedDate) : undefined}
      onSelect={(date) => onChange(date?.toISOString()?.split("T")[0] ?? null)}
    />
  </div>
);
