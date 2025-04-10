import { useEffect, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { useDebounce } from "use-debounce";

import { ButtonWithPopover } from "../../components/ButtonWithPopover";
// import { ConfirmModal } from "../../components/ConfirmModal";
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
    <label className="input w-full bg-base-200 focus-within:outline-none shadow-none focus-within:shadow-none rounded-field border-1 border-base-200">
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

const HabitInput = ({ habit, updateHabit }: THabitInputProps) => {
  const [title, setTitle] = useState<string>(habit.title);
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [debouncedTitle] = useDebounce(title, 1000);

  useEffect(() => {
    if (debouncedTitle !== habit.title) {
      updateHabit({ id: habit.id, title: debouncedTitle });
    }
  }, [debouncedTitle]);

  const onChangeTitle = ({
    currentTarget: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title) {
      updateHabit({ id: habit.id, title });
    }
  };

  const onChangeEmoji = (value: string) => {
    updateHabit({ id: habit.id, emoji: value });
  };

  // const openModal = () => setIsModalOpen(true);
  // const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mb-4">
      <input
        className="input input-bordered w-full mb-2"
        onChange={onChangeTitle}
        onKeyDown={onEnter}
        type="text"
        value={habit.title}
      />

      <ButtonWithPopover
        buttonVariant="round"
        onChange={onChangeEmoji}
        popoverId={`habit-${habit.id}-emoji`}
        variant="emoji"
      >
        {habit.emoji}
      </ButtonWithPopover>

      <ButtonWithPopover
        buttonVariant="round"
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
        {habit.daysActive.length}
      </ButtonWithPopover>

      <input
        className="input input-bordered w-full mb-2"
        onChange={(e) => {
          const steps = parseInt(e.currentTarget.value, 10);
          if (steps > 0) updateHabit({ id: habit.id, steps });
        }}
        type="number"
        value={habit.steps}
      />
    </div>
  );
};

//   return (
//     <>
//       <div
//         className={classNames("join min-w-standard h-standard", {
//           "pt-4 sticky top-0": !list,
//         })}
//       >
//         <ButtonWithPopover
//           buttonVariant="left-join"
//           onChange={onChangeEmoji}
//           popoverId="emoji-picker"
//           variant="emoji"
//         >
//           {emoji}
//         </ButtonWithPopover>
//         <label className="input join-item bg-base-100 focus-within:outline-none shadow-none focus-within:shadow-none rounded-r-[var(--radius-field)] h-standard border-1 border-base-200 text-[1rem]">
//           <input
//             onChange={onChangeTitle}
//             onKeyDown={onEnter}
//             placeholder="New List"
//             type="text"
//             value={title}
//           />
//           {list && (
//             <span className="btn btn-link" onClick={openModal}>
//               <Archive className="text-base-content/60 hover:text-error" />
//             </span>
//           )}
//         </label>
//       </div>
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
