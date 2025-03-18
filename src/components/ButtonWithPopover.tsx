import { Fragment } from "react";
import { DayPicker } from "react-day-picker";
import EmojiPicker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import classNames from "classnames";

export type TOnChange<T> = (id: T) => void;

export type TOption = {
  emoji?: string;
  id: string | number | null;
  isSelected: boolean;
  title: string;
};

export type TSegmentedOption = {
  title: string;
  options: Array<TOption & { isDangerous?: boolean; onChange: () => void }>;
};

type TCommonProps = {
  buttonClassName?: string;
  buttonVariant: "round" | "left-join" | "none";
  children: React.ReactNode;
  wrapperClassName?: string;
};

type TConditionalProps =
  | {
      variant: "calendar";
      onChange: TOnChange<string | null>;
      selectedDate?: string | null;
    }
  | {
      variant: "menu";
      onChange: TOnChange<string | number | null>;
      options: TOption[];
    }
  | { variant: "segmentedMenu"; options: TSegmentedOption[] }
  | { variant: "emoji"; onChange: TOnChange<string> };

type TButtonWithPopoverProps = TCommonProps & TConditionalProps;

const roundButtonClasses =
  "w-5 h-5 rounded-box outline outline-current/25 flex items-center justify-center text-xs hover:opacity-90";
const leftJoinButtonClasses =
  "btn join-item p-4 h-standard min-w-20 bg-base-300 border-none text-xs";

export const ButtonWithPopover = ({
  buttonClassName,
  buttonVariant,
  children,
  wrapperClassName,
  ...props
}: TButtonWithPopoverProps) => (
  <div className={classNames("dropdown", wrapperClassName)}>
    <div
      tabIndex={0}
      role="button"
      className={classNames(
        "cursor-pointer",
        {
          [roundButtonClasses]: buttonVariant === "round",
          [leftJoinButtonClasses]: buttonVariant === "left-join",
        },
        buttonClassName,
      )}
    >
      {children}
    </div>
    {props.variant === "menu" ? (
      <DropdownMenu onChange={props.onChange} options={props.options} />
    ) : null}

    {props.variant === "segmentedMenu" ? (
      <SegmentedMenu options={props.options} />
    ) : null}

    {props.variant === "calendar" ? (
      <Calendar
        onChange={props.onChange}
        selectedDate={props.selectedDate || null}
      />
    ) : null}

    {props.variant === "emoji" ? <Emoji onChange={props.onChange} /> : null}
  </div>
);

type TDropdownMenuProps = {
  onChange: TOnChange<string | number | null>;
  options: TOption[];
};

const popoverStyles =
  "dropdown-content bg-base-100 rounded-box shadow-sm text-base-content";

const DropdownMenu = ({ onChange, options }: TDropdownMenuProps) => (
  <ul
    className={classNames(
      popoverStyles,
      "menu p-2 min-w-52 border-1 border-base-200",
    )}
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
          {option.emoji ? <span>{option.emoji}</span> : null}
          <span>{option.title}</span>
        </a>
      </li>
    ))}
  </ul>
);

const SegmentedMenu = ({ options }: { options: TSegmentedOption[] }) => (
  <ul
    className={classNames(
      popoverStyles,
      "menu p-2 min-w-52 border-1 border-base-200",
    )}
    tabIndex={0}
  >
    {options.map((segment) => (
      <Fragment key={segment.title}>
        <div className="divider divider-start">{segment.title}</div>
        {segment.options.map((option) => (
          <li key={option.id}>
            <a
              onClick={option.onChange}
              className={classNames("flex items-center gap-2", {
                "bg-base-300": option.isSelected,
              })}
            >
              {option.emoji ? <span>{option.emoji}</span> : null}
              <span
                className={classNames({ "text-red-600": option.isDangerous })}
              >
                {option.title}
              </span>
            </a>
          </li>
        ))}
      </Fragment>
    ))}
  </ul>
);

type TCalendarProps = {
  onChange: TOnChange<string | null>;
  selectedDate: string | null;
};

const daySize = "30px";

const Calendar = ({ onChange, selectedDate }: TCalendarProps) => (
  <div className={classNames(popoverStyles)} tabIndex={0}>
    <DayPicker
      className="react-day-picker flex cursor-pointer"
      classNames={{
        outside: "text-base-content/30",
        today: "outline-1 outline-primary rounded-field",
        selected: "bg-base-300 text-current rounded-field",
      }}
      mode="single"
      onSelect={(date) => onChange(date?.toISOString()?.split("T")[0] ?? null)}
      selected={toDateTime(selectedDate)}
      showOutsideDays
      styles={{
        week: { height: daySize },
        day: { width: daySize, height: daySize },
        day_button: { width: daySize, height: daySize },
      }}
      weekStartsOn={1}
    />
  </div>
);

const Emoji = ({ onChange }: { onChange: TOnChange<string> }) => (
  <div className={classNames(popoverStyles)} tabIndex={0}>
    <EmojiPicker
      data={emojiData}
      maxFrequentRows={0}
      onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
      previewEmoji="dog"
    />
  </div>
);

// Helper function to correctly parse YYYY-MM-DD without timezone issues
const toDateTime = (date: string | null) => {
  if (!date) return undefined;

  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};
