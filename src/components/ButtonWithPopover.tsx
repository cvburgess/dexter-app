import { Fragment, useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import EmojiPicker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import classNames from "classnames";
import { useDebounce } from "use-debounce";
import { CheckFat } from "@phosphor-icons/react";

import { arraysAreEqual } from "../utils/arraysAreEqual";

export type TOnChange<T> = (id: T) => void;

export type TOption = {
  count?: number;
  emoji?: string;
  icon?: React.ReactNode;
  id: string | number | null;
  isSelected: boolean;
  title: string;
};

export type TSegmentedOption = {
  title: string;
  display?: "row" | "column";
  options: Array<TOption & { isDangerous?: boolean; onChange: () => void }>;
};

type TCommonProps = {
  buttonClassName?: string;
  buttonVariant: "round" | "join" | "left-join" | "none";
  children: React.ReactNode;
  popoverId: string;
  title: string;
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
  | {
      variant: "multiSelectMenu";
      onChange: TOnChange<Array<string | number | null>>;
      options: Omit<TOption, "isSelected">[];
      selected: Array<string | number>;
    }
  | { variant: "segmentedMenu"; options: TSegmentedOption[] }
  | { variant: "emoji"; onChange: TOnChange<string> };

type TButtonWithPopoverProps = TCommonProps & TConditionalProps;

const roundButtonClasses =
  "w-5 h-5 rounded-field outline outline-current/25 flex items-center justify-center hover:opacity-90";

const joinButtonClasses = "btn join-item p-4 min-h-standard";

const leftJoinButtonClasses = joinButtonClasses + " border-none bg-base-300";

export const ButtonWithPopover = ({
  buttonClassName,
  buttonVariant,
  children,
  popoverId,
  title,
  wrapperClassName,
  ...props
}: TButtonWithPopoverProps) => (
  <div className={classNames(wrapperClassName)}>
    <button
      className={classNames(
        "relative cursor-pointer",
        {
          [roundButtonClasses]: buttonVariant === "round",
          [joinButtonClasses]: buttonVariant === "join",
          [leftJoinButtonClasses]: buttonVariant === "left-join",
        },
        props.variant === "emoji" ? "text-3xl" : "text-sm",
        buttonClassName,
      )}
      popovertarget={popoverId}
      title={title}
    >
      {children}
    </button>
    {props.variant === "menu" && (
      <DropdownMenu
        onChange={props.onChange}
        options={props.options}
        popoverId={popoverId}
      />
    )}

    {props.variant === "multiSelectMenu" && (
      <MultiSelectMenu
        onChange={props.onChange}
        options={props.options}
        popoverId={popoverId}
        selected={props.selected}
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
  minWidth: "anchor-size(width)",
  positionAnchor: "auto",
  positionTryFallbacks: "top, left, right, flip-inline flip-block",
  transition: "opacity 0.15s ease-in-out, transform 0.15s ease-in-out",
} as React.CSSProperties;

const popoverStyles =
  "dropdown absolute bg-base-100 rounded-box shadow-sm !text-base-content mt-1 max-h-[55vh] no-scrollbar";

type TDropdownMenuProps = {
  onChange: TOnChange<string | number | null>;
  options: TOption[];
  popoverId: string;
};

const DropdownMenu = ({ onChange, options, popoverId }: TDropdownMenuProps) => (
  <ul
    className={classNames(
      popoverStyles,
      "menu p-2 min-w-48 border-1 border-base-200",
    )}
    id={popoverId}
    popover="auto"
    style={popoverPolyfill}
  >
    {options.map((option) => (
      <li key={option.id}>
        <a
          className={classNames("flex items-center gap-2 text-sm", {
            "bg-base-300": option.isSelected,
          })}
          onClick={() => onChange(option.id)}
        >
          {option.count ? (
            <Badge count={option.count} />
          ) : (
            option.emoji || option.icon
          )}
          <span
            className={classNames({
              "ml-1": option.count || option.emoji || option.icon,
            })}
          >
            {option.title}
          </span>
        </a>
      </li>
    ))}
  </ul>
);

const Badge = ({ count }: { count: number }) => {
  if (!count) return null;

  return (
    <span className="flex items-center justify-center bg-warning text-warning-content text-sm size-[18px] -m-[3px] rounded-box">
      {count}
    </span>
  );
};

type TMultiSelectProps = {
  onChange: TOnChange<Array<string | number | null>>;
  options: Omit<TOption, "isSelected">[];
  popoverId: string;
  selected: Array<string | number>;
};

const MultiSelectMenu = ({
  onChange,
  options,
  popoverId,
  selected,
}: TMultiSelectProps) => {
  const [selectedIds, setSelectedIds] = useState(selected);
  const [debouncedIds] = useDebounce(selectedIds, 500);

  useEffect(() => {
    if (!arraysAreEqual(selected, debouncedIds)) {
      onChange(debouncedIds);
    }
  }, [debouncedIds]);

  const onClick = (id: string | number) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelectedIds);
  };

  return (
    <ul
      className={classNames(
        popoverStyles,
        "menu p-2 min-w-48 border-1 border-base-200",
      )}
      id={popoverId}
      popover="auto"
      style={popoverPolyfill}
    >
      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id);

        return (
          <li key={option.id}>
            <a
              className={classNames("flex items-center gap-2 text-sm")}
              onClick={() => onClick(option.id)}
            >
              {isSelected ? (
                <CheckFat weight="fill" />
              ) : (
                <span className="size-[12px]" />
              )}
              <span className="ml-1">{option.title}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

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
        <div className="divider divider-start mx-2 my-2 text-sm">
          {segment.title}
        </div>
        <div
          className={classNames("mx-2", {
            "flex gap-1": segment.display === "row",
          })}
        >
          {segment.options.map((option) => (
            <li
              className={classNames({
                "w-auto items-start": segment.display === "row",
              })}
              key={option.id}
              title={segment.display === "row" ? option.title : undefined}
            >
              <a
                className={classNames("text-sm", {
                  "flex items-center gap-2": segment.display !== "row",
                  "bg-base-300": option.isSelected,
                })}
                onClick={option.onChange}
              >
                {option.emoji}
                {option.icon}
                {segment.display !== "row" && (
                  <span
                    className={classNames({
                      "text-red-600": option.isDangerous,
                      "ml-1": option.emoji || option.icon,
                    })}
                  >
                    {option.title}
                  </span>
                )}
              </a>
            </li>
          ))}
        </div>
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
      navPosition="none"
      onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
      perLine={7}
      previewEmoji="dog"
      previewPosition="none"
    />
  </div>
);

// Helper function to correctly parse YYYY-MM-DD without timezone issues
const toDateTime = (date: string | null) => {
  if (!date) return undefined;

  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};
