import { useEffect, useState } from "react";
import { Archive, Pause, Play, Plus } from "@phosphor-icons/react";
import { useDebounce } from "use-debounce";
import classNames from "classnames";

import { ButtonWithPopover } from "../../components/ButtonWithPopover";
import { ConfirmModal } from "../../components/ConfirmModal";
import { InputWithIcon } from "../../components/InputWithIcon";
import { SettingsOption } from "../../components/SettingsOption";

import { useHabits } from "../../hooks/useHabits";
import { usePreferences } from "../../hooks/usePreferences";

import { TCreateHabit, THabit, TUpdateHabit } from "../../api/habits";

export const Habits = () => {
  const [habits, { createHabit, updateHabit, deleteHabit }] = useHabits();
  const [preferences] = usePreferences();

  return (
    <>
      <SettingsOption
        options={[
          {
            id: "true",
            title: "Enabled",
            isSelected: preferences.enableHabits,
          },
          {
            id: "false",
            title: "Disabled",
            isSelected: !preferences.enableHabits,
          },
        ]}
        setting="enableHabits"
        title="Habit Tracking"
      />

      {preferences.enableHabits && (
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend ml-2 text-base">Habits</legend>
          {habits.map((habit) => (
            <HabitInput
              deleteHabit={deleteHabit}
              habit={habit}
              key={habit.id}
              updateHabit={updateHabit}
            />
          ))}

          <NewHabitInput createHabit={createHabit} />
        </fieldset>
      )}
    </>
  );
};

type TNewHabitProps = {
  createHabit: (habit: TCreateHabit) => void;
};

const NewHabitInput = ({ createHabit }: TNewHabitProps) => {
  const defaultHabit: TCreateHabit = {
    title: "",
    emoji: "😄",
    daysActive: [1, 2, 3, 4, 5, 6, 7],
    steps: 1,
  };

  return (
    <InputWithIcon
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.currentTarget.value.trim()) {
          createHabit({
            ...defaultHabit,
            title: e.currentTarget.value.trim(),
          });
          e.currentTarget.value = "";
        }
      }}
      type="text"
    >
      <Plus />
    </InputWithIcon>
  );
};

type THabitInputProps = {
  deleteHabit: (id: string) => void;
  habit: THabit;
  updateHabit: (habit: TUpdateHabit) => void;
};

const inputClasses =
  "input join-item bg-base-100 focus-within:outline-none shadow-none focus-within:shadow-none h-standard border-1 border-base-200 text-base";

const HabitInput = ({ deleteHabit, habit, updateHabit }: THabitInputProps) => {
  const [title, setTitle] = useState<string>(habit.title);
  const [debouncedTitle] = useDebounce(title, 1000);

  const [steps, setSteps] = useState<number | string>(habit.steps);
  const [debouncedSteps] = useDebounce(steps, 500);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (debouncedTitle !== habit.title) {
      updateHabit({ id: habit.id, title: debouncedTitle });
    }
  }, [debouncedTitle]);

  useEffect(() => {
    const isValid =
      typeof debouncedSteps === "number" &&
      debouncedSteps > 0 &&
      debouncedSteps < 1000;

    if (debouncedSteps !== habit.steps && isValid) {
      updateHabit({ id: habit.id, steps: debouncedSteps });
    }
  }, [debouncedSteps]);

  const onChangeTitle = ({
    currentTarget: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  const onChangeSteps = ({
    currentTarget: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSteps(parseInt(value, 10) || "");
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title) {
      updateHabit({ id: habit.id, title });
    }
  };

  const onChangeEmoji = (value: string) => {
    updateHabit({ id: habit.id, emoji: value });
  };

  const onArchive = (id: string) => {
    updateHabit({ id, isArchived: true });
    setIsModalOpen(false);
  };

  const onNumberInputOnly = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the key is not a number
    if (
      !/^[0-9]$/.test(e.key) &&
      ![
        "Backspace",
        "Tab",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      e.preventDefault();
      return false;
    }
    return true;
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="mb-2 join h-standard w-full">
        <ButtonWithPopover
          buttonVariant="left-join"
          onChange={onChangeEmoji}
          popoverId={`habit-${habit.id}-emoji`}
          title="Emoji"
          variant="emoji"
        >
          {habit.emoji}
        </ButtonWithPopover>

        <input
          className={classNames(inputClasses, "pl-4 grow")}
          onChange={onChangeTitle}
          onKeyDown={onEnter}
          type="text"
          value={title}
        />

        <label className={classNames(inputClasses, "px-4 w-fit")}>
          <input
            className="w-content-size text-right text-base"
            onChange={onChangeSteps}
            onKeyDown={onNumberInputOnly}
            value={steps}
          />
          x daily
        </label>

        <ButtonWithPopover
          buttonClassName="text-nowrap bg-base-100 ml-[-1px] font-normal !text-base"
          buttonVariant="join"
          onChange={(daysActive: number[]) =>
            updateHabit({ id: habit.id, daysActive })
          }
          options={[
            { id: 1, title: "Monday" },
            { id: 2, title: "Tuesday" },
            { id: 3, title: "Wednesday" },
            { id: 4, title: "Thursday" },
            { id: 5, title: "Friday" },
            { id: 6, title: "Saturday" },
            { id: 7, title: "Sunday" },
          ]}
          popoverId={`habit-${habit.id}-days-active`}
          selected={habit.daysActive}
          title="Days Active"
          variant="multiSelectMenu"
        >
          {habit.daysActive.length} x weekly
        </ButtonWithPopover>

        <span
          className="btn join-item h-standard bg-base-100 text-base-content/60 hover:text-warning"
          onClick={() =>
            updateHabit({ id: habit.id, isPaused: !habit.isPaused })
          }
        >
          {habit.isPaused ? (
            <Play weight="duotone" />
          ) : (
            <Pause weight="duotone" />
          )}
        </span>

        <span
          className="btn join-item h-standard bg-base-100 text-base-content/60 hover:text-error"
          onClick={openModal}
        >
          <Archive />
        </span>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        message={
          <>
            Archive will delete the habit
            <br /> but retain historical habit data.
            <br /> <br />
            To erase all historical data, <br />
            select <span className="font-bold">delete</span> instead.
          </>
        }
        onClose={closeModal}
        options={[
          {
            action: () => onArchive(habit.id),
            buttonClass: "btn-error",
            title: "Archive",
          },
          {
            action: () => deleteHabit(habit.id),
            buttonClass: "btn-error",
            title: "Delete",
          },
        ]}
        title={`Archive ${habit.title}?`}
      />
    </>
  );
};
