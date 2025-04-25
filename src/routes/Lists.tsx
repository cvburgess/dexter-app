import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Archive } from "@phosphor-icons/react";
import classNames from "classnames";

import { Board, TColumn } from "../components/Board.tsx";
import { ButtonWithPopover } from "../components/ButtonWithPopover.tsx";
import { ConfirmModal } from "../components/ConfirmModal.tsx";
import { TextToolbar } from "../components/Toolbar.tsx";
import { DraggableView } from "../components/View.tsx";

import { useLists } from "../hooks/useLists.tsx";
import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

import { TCreateList, TList, TUpdateList } from "../api/lists.ts";
import { TTask } from "../api/tasks.ts";

export const Lists = () => {
  const [lists, { createList, updateList }] = useLists();
  const [tasks] = useTasks({ filters: taskFilters.incomplete });

  const columns = makeColumns(lists, tasks, updateList);

  return (
    <DraggableView>
      <TextToolbar title="Lists" />
      <Board
        appendAfter={<ListInput onChange={createList} />}
        canCreateTasks
        columns={columns}
        groupBy="listId"
      />
    </DraggableView>
  );
};

type TListInputProps = {
  list?: TList;
  onArchive?: (id: string) => void;
  onChange?: (list: TCreateList | TUpdateList) => void;
};

const ListInput = ({ list, onArchive, onChange }: TListInputProps) => {
  const [title, setTitle] = useState<string>(list?.title || "");
  const [emoji, setEmoji] = useState<string>(list?.emoji || "🐶");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [debouncedTitle] = useDebounce(title, 1000);

  useEffect(() => {
    if (list && debouncedTitle !== list.title) {
      onChange({ id: list.id, title: debouncedTitle });
    }
  }, [debouncedTitle]);

  const resetForm = () => {
    setTitle("");
    setEmoji("🐶");
  };

  const onChangeTitle = ({
    currentTarget: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (list) onChange({ id: list.id, title: value });
    setTitle(value);
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title) {
      if (list) {
        onChange({ id: list.id, title });
      } else {
        onChange({ title, emoji });
        resetForm();
      }
    }
  };

  const onChangeEmoji = (value: string) => {
    if (list) onChange({ id: list.id, emoji: value });
    setEmoji(value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Font Size of 1rem chosen to match a large badge in DaisyUI
  // https://github.com/saadeghi/daisyui/blob/master/packages/daisyui/src/components/badge.css#L109
  return (
    <>
      <div
        className={classNames("join min-w-standard h-standard", {
          "pt-4 sticky top-0": !list,
        })}
      >
        <ButtonWithPopover
          buttonVariant="left-join"
          onChange={onChangeEmoji}
          popoverId={`${list?.id ?? "new-list"}-emoji-picker`}
          title="Emoji"
          variant="emoji"
        >
          {emoji}
        </ButtonWithPopover>
        <label className="input join-item bg-base-100 focus-within:outline-none shadow-none focus-within:shadow-none rounded-r-[var(--radius-field)] h-standard border-1 border-base-200 text-lg">
          <input
            onChange={onChangeTitle}
            onKeyDown={onEnter}
            placeholder="New List"
            type="text"
            value={title}
          />
          {list && (
            <span className="btn btn-link" onClick={openModal}>
              <Archive className="text-base-content/60 hover:text-error" />
            </span>
          )}
        </label>
      </div>
      {list && (
        <ConfirmModal
          isOpen={isModalOpen}
          message={
            <>
              This will archive the list and <br />
              move any open tasks to{" "}
              <span className="font-bold">won&apos;t do</span>.
            </>
          }
          onClose={closeModal}
          options={[
            {
              action: () => onArchive(list.id),
              buttonClass: "btn-error",
              title: "Archive",
            },
          ]}
          title={`Archive ${list.title}?`}
        />
      )}
    </>
  );
};

type NoList = Omit<TList, "id"> & { id: null };

const makeColumns = (
  lists: Array<TList | NoList> | undefined = [],
  tasks: TTask[] | undefined = [],
  updateList: (list: TUpdateList) => void,
): TColumn[] =>
  [{ createdAt: "", id: null, title: "No List" }, ...lists].map(
    (list: TList | NoList) => ({
      autoCollapse: list.id === null,
      id: list.id,
      title: list.title,
      titleComponent: list.id && (
        <ListInput
          list={list}
          onArchive={() => updateList({ id: list.id, isArchived: true })}
          onChange={updateList}
        />
      ),
      tasks: tasks?.filter((task: TTask) => task.listId === list.id),
    }),
  );
