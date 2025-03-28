import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Archive } from "@phosphor-icons/react";
import classNames from "classnames";

import { Board, TColumn } from "../components/Board.tsx";
import { ConfirmModal } from "../components/ConfirmModal.tsx";
import { DraggableView, DrawerContainer } from "../components/View.tsx";
import { QuickDrawer } from "../components/QuickPlanner.tsx";
import { TextToolbar } from "../components/Toolbar.tsx";

import { useGoals } from "../hooks/useGoals.tsx";
import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

import { TCreateGoal, TGoal, TUpdateGoal } from "../api/goals.ts";
import { TTask } from "../api/tasks.ts";

export const Goals = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [goals, { createGoal, updateGoal }] = useGoals();
  const [tasks] = useTasks();

  const columns = makeColumns(goals, tasks, updateGoal);

  return (
    <DraggableView>
      <TextToolbar title="Goals" toggleQuickPlan={() => setIsOpen(!isOpen)} />

      <DrawerContainer>
        <Board
          appendAfter={<GoalInput onChange={createGoal} />}
          canCreateTasks
          columns={columns}
          groupBy="goalId"
        />
        <QuickDrawer
          baseFilters={taskFilters.noGoal}
          columnId="goalId:null"
          isOpen={isOpen}
        />
      </DrawerContainer>
    </DraggableView>
  );
};

type TGoalInputProps = {
  goal?: TGoal;
  onArchive?: (id: string) => void;
  onChange?: (goal: TCreateGoal | TUpdateGoal) => void;
};

const GoalInput = ({ goal, onArchive, onChange }: TGoalInputProps) => {
  const [title, setTitle] = useState<string>(goal?.title || "");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [debouncedTitle] = useDebounce(title, 1000);

  useEffect(() => {
    if (goal && debouncedTitle !== goal.title) {
      onChange({ id: goal.id, title: debouncedTitle });
    }
  }, [debouncedTitle]);

  const resetForm = () => {
    setTitle("");
  };

  const onChangeTitle = ({
    currentTarget: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (goal) onChange({ id: goal.id, title: value });
    setTitle(value);
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title) {
      if (goal) {
        onChange({ id: goal.id, title });
      } else {
        onChange({ title } as TCreateGoal);
        resetForm();
      }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Font Size of 1rem chosen to match a large badge in DaisyUI
  // https://github.com/saadeghi/daisyui/blob/master/packages/daisyui/src/components/badge.css#L109
  return (
    <>
      <div
        className={classNames("join min-w-standard h-standard", {
          "pt-4 sticky top-0": !goal,
        })}
      >
        <label className="input bg-base-100 focus-within:outline-none shadow-none focus-within:shadow-none rounded-field h-standard border-1 border-base-200 text-[1rem] pl-6">
          <input
            onChange={onChangeTitle}
            onKeyDown={onEnter}
            placeholder="New Goal"
            type="text"
            value={title}
          />
          {goal && (
            <span className="btn btn-link" onClick={openModal}>
              <Archive className="text-base-content/60 hover:text-error" />
            </span>
          )}
        </label>
      </div>
      {goal && (
        <ConfirmModal
          confirmButtonText="Archive"
          isOpen={isModalOpen}
          message={
            <>
              This will archive the goal and <br />
              move any open tasks to{" "}
              <span className="font-bold">won&apos;t do</span>.
            </>
          }
          onClose={closeModal}
          onConfirm={() => onArchive(goal.id)}
          title={`Archive ${goal.title}?`}
        />
      )}
    </>
  );
};

const makeColumns = (
  goals: Array<TGoal> | undefined = [],
  tasks: TTask[] | undefined = [],
  updateGoal: (goal: TUpdateGoal) => void,
): TColumn[] =>
  goals.map((goal: TGoal) => ({
    autoCollapse: goal.id === null,
    id: goal.id,
    title: goal.title,
    titleComponent: goal.id && (
      <GoalInput
        goal={goal}
        onArchive={() => updateGoal({ id: goal.id, isArchived: true })}
        onChange={updateGoal}
      />
    ),
    tasks: tasks?.filter((task: TTask) => task.goalId === goal.id),
  }));
