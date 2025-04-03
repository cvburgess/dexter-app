import { Fragment } from "react";
import { DayPicker } from "react-day-picker";
import EmojiPicker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import classNames from "classnames";

export type TOnChange<T> = (id: T) => void;

export type TOption = {
  emoji?: string;
  icon?: React.ReactNode;
  id: string | number | null;
  isSelected: boolean;
  title: string;
};

export type TSegmentedOption = {
  title: string;
  options: Array<TOption & { isDangerous?: boolean; onChange: () => void }>;
};

type TCommonProps = {
  alignMenuLeft?: boolean;
  buttonClassName?: string;
  buttonVariant: "round" | "left-join" | "none";
  children: React.ReactNode;
  popoverId: string;
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
  "w-5 h-5 rounded-field outline outline-current/25 flex items-center justify-center hover:opacity-90";
const leftJoinButtonClasses =
  "btn join-item p-4 h-standard min-w-20 bg-base-300 border-none";

export const ButtonWithPopover = ({
  alignMenuLeft = false,
  buttonClassName,
  buttonVariant,
  children,
  popoverId,
  wrapperClassName,
  ...props
}: TButtonWithPopoverProps) => (
  <div className={classNames(wrapperClassName)}>
    <button
      className={classNames(
        "relative cursor-pointer",
        {
          [roundButtonClasses]: buttonVariant === "round",
          [leftJoinButtonClasses]: buttonVariant === "left-join",
        },
        props.variant === "emoji" ? "text-2xl" : "text-xs",
        buttonClassName,
      )}
      popovertarget={popoverId}
      // style={{ anchorName: `--${popoverId}` } as React.CSSProperties}
    >
      {children}
    </button>
    {props.variant === "menu" && (
      <DropdownMenu
        alignLeft={alignMenuLeft}
        onChange={props.onChange}
        options={props.options}
        popoverId={popoverId}
      />
    )}

    {props.variant === "segmentedMenu" && (
      <SegmentedMenu options={props.options} popoverId={popoverId} />
    )}

    {props.variant === "calendar" && (
      <Calendar
        onChange={props.onChange}
        popoverId={popoverId}
        selectedDate={props.selectedDate || null}
      />
    )}

    {props.variant === "emoji" && (
      <Emoji onChange={props.onChange} popoverId={popoverId} />
    )}
  </div>
);

const popoverPolyfill = {
  position: "absolute",
  positionAnchor: "auto",
  left: "anchor(center)",
  top: "anchor(bottom)",
  justifySelf: "anchor-center",
  marginTop: "4px",
  transition: "opacity 0.15s ease-in-out, transform 0.15s ease-in-out",
} as React.CSSProperties;

type TDropdownMenuProps = {
  alignLeft?: boolean;
  onChange: TOnChange<string | number | null>;
  options: TOption[];
  popoverId: string;
};

const popoverStyles =
  "dropdown bg-base-100 rounded-box shadow-sm !text-base-content";

const DropdownMenu = ({
  alignLeft,
  onChange,
  options,
  popoverId,
}: TDropdownMenuProps) => (
  <ul
    className={classNames(
      popoverStyles,
      "menu p-2 min-w-48 border-1 border-base-200",
      { "!justify-self-start -ml-6": alignLeft },
    )}
    id={popoverId}
    popover="auto"
    style={popoverPolyfill}
  >
    {options.map((option) => (
      <li key={option.id}>
        <a
          className={classNames("flex items-center gap-2 text-xs", {
            "bg-base-300": option.isSelected,
          })}
          onClick={() => onChange(option.id)}
        >
          {option.emoji}
          {option.icon}
          <span className={classNames({ "ml-1": option.emoji || option.icon })}>
            {option.title}
          </span>
        </a>
      </li>
    ))}
  </ul>
);

type TSegmentedMenuProps = {
  options: TSegmentedOption[];
  popoverId: string;
};

const SegmentedMenu = ({ options, popoverId }: TSegmentedMenuProps) => (
  <ul
    className={classNames(
      popoverStyles,
      "menu p-2 min-w-48 border-1 border-base-200",
    )}
    id={popoverId}
    popover="auto"
    style={popoverPolyfill}
  >
    {options.map((segment) => (
      <Fragment key={segment.title}>
        <div className="divider divider-start mx-2 my-2 text-xs">
          {segment.title}
        </div>
        {segment.options.map((option) => (
          <li key={option.id}>
            <a
              className={classNames("flex items-center gap-2 mx-2 text-xs", {
                "bg-base-300": option.isSelected,
              })}
              onClick={option.onChange}
            >
              {option.emoji}
              {option.icon}
              <span
                className={classNames({
                  "text-red-600": option.isDangerous,
                  "ml-1": option.emoji || option.icon,
                })}
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
  popoverId: string;
  selectedDate: string | null;
};

const daySize = "30px";

const Calendar = ({ onChange, popoverId, selectedDate }: TCalendarProps) => (
  <div
    className={classNames(popoverStyles)}
    id={popoverId}
    popover="auto"
    style={popoverPolyfill}
  >
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

type TEmojiProps = {
  onChange: TOnChange<string>;
  popoverId: string;
};

const Emoji = ({ onChange, popoverId }: TEmojiProps) => (
  <div
    className={classNames(popoverStyles)}
    id={popoverId}
    popover="auto"
    style={popoverPolyfill}
  >
    <EmojiPicker
      data={emojiData}
      maxFrequentRows={0}
      onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
      perLine={7}
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
