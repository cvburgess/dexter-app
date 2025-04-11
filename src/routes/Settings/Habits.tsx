import { useEffect, useState } from "react";
import { Archive, Plus } from "@phosphor-icons/react";
import { useDebounce } from "use-debounce";

import { ButtonWithPopover } from "../../components/ButtonWithPopover";
// import { ConfirmModal } from "../../components/ConfirmModal";
import { SettingsOption } from "../../components/SettingsOption";

import { useHabits } from "../../hooks/useHabits";
import { usePreferences } from "../../hooks/usePreferences";

import { TCreateHabit, THabit, TUpdateHabit } from "../../api/habits";
import classNames from "classnames";

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
        <fieldset className="fieldset w-full mt-4">
          <legend className="fieldset-legend ml-2 text-sm">Habits</legend>
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
    <label className="input w-full h-standard bg-base-200 focus-within:outline-none shadow-none focus-within:shadow-none rounded-field border-1 border-base-200">
      <span>
        <Plus className="text-base-content/60" />
      </span>
      <input
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
      />
    </label>
  );
};

type THabitInputProps = {
  habit: THabit;
  deleteHabit: (id: string) => void;
  updateHabit: (habit: TUpdateHabit) => void;
};

const inputClasses =
  "input join-item bg-base-100 focus-within:outline-none shadow-none focus-within:shadow-none h-standard border-1 border-base-200";

const HabitInput = ({ habit, updateHabit }: THabitInputProps) => {
  const [title, setTitle] = useState<string>(habit.title);
  const [debouncedTitle] = useDebounce(title, 1000);

  const [steps, setSteps] = useState<number | string>(habit.steps);
  const [debouncedSteps] = useDebounce(steps, 500);

  const [_isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
  // const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mb-2 join h-standard w-full">
      <ButtonWithPopover
        buttonVariant="left-join"
        onChange={onChangeEmoji}
        popoverId={`habit-${habit.id}-emoji`}
        variant="emoji"
      >
        {habit.emoji}
      </ButtonWithPopover>

      <input
        className={classNames(inputClasses, "pl-4 grow")}
        onChange={onChangeTitle}
        onKeyDown={onEnter}
        type="text"
        value={habit.title}
      />

      <label className={classNames(inputClasses, "px-4 w-fit")}>
        <input
          className="w-content-size text-right"
          onChange={onChangeSteps}
          onKeyDown={onNumberInputOnly}
          value={steps}
        />
        x daily
      </label>

      <ButtonWithPopover
        buttonClassName="text-nowrap bg-base-100 ml-[-1px]"
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
        variant="multiSelectMenu"
      >
        {habit.daysActive.length}x weekly
      </ButtonWithPopover>

      <span
        className="btn join-item h-standard bg-base-100 text-base-content/60 hover:text-error"
        onClick={openModal}
      >
        <Archive />
      </span>
    </div>
  );
};

//   return (
//     <>
//       {list && (
//         <ConfirmModal
//           confirmButtonText="Archive"
//           isOpen={isModalOpen}
//           message={
//             <>
//               This will archive the list and <br />
//               move any open tasks to{" "}
//               <span className="font-bold">won&apos;t do</span>.
//             </>
//           }
//           onClose={closeModal}
//           onConfirm={() => onArchive(list.id)}
//           title={`Archive ${list.title}?`}
//         />
//       )}
//     </>
//   );
// };
