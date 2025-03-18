import { useState } from "react";

import { Board, TColumn } from "../components/Board.tsx";
import { ButtonWithPopover } from "../components/ButtonWithPopover.tsx";
import { Toolbar } from "../components/Toolbar.tsx";
import { View } from "../components/View.tsx";

import { useLists } from "../hooks/useLists.tsx";
import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

import { TCreateList, TList, TUpdateList } from "../api/lists.ts";
import { TTask } from "../api/tasks.ts";

export const Lists = () => {
  const [lists, { createList }] = useLists();
  const [tasks] = useTasks(taskFilters.incomplete);

  const columns = makeColumns(lists, tasks);

  return (
    <View>
      <Toolbar>
        <p className="btn btn-ghost"> Lists </p>
      </Toolbar>
      <Board
        appendAfter={<ListInput onChange={createList} />}
        canCreateTasks
        columns={columns}
        groupBy="listId"
      />
    </View>
  );
};

type TListInputProps = {
  list?: TList;
  onChange?: (list: TCreateList | TUpdateList) => void;
};

const ListInput = ({ list, onChange }: TListInputProps) => {
  const [title, setTitle] = useState<string>(list?.title || "");
  const [emoji, setEmoji] = useState<string>("🐶");

  const onChangeEmoji = (newEmoji: string) => {
    list ? onChange({ id: list.id, emoji: newEmoji }) : setEmoji(newEmoji);
  };

  // Font Size of 1rem chosen to match a large badge in DaisyUI
  // https://github.com/saadeghi/daisyui/blob/master/packages/daisyui/src/components/badge.css#L109
  return (
    <div className="join min-w-standard h-standard pt-4 sticky top-0">
      <ButtonWithPopover
        buttonVariant="left-join"
        variant="emoji"
        onChange={onChangeEmoji}
      >
        {emoji}
      </ButtonWithPopover>
      <input
        className="input join-item bg-base-100 focus:outline-none shadow-none focus:shadow-none rounded-r-[var(--radius-box)] h-standard border-1 border-base-200 text-[1rem]"
        placeholder="New List"
        type="text"
        onChange={(e) => setTitle(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && title) {
            list
              ? onChange({ id: list.id, title })
              : onChange({ title, emoji });
          }
        }}
        value={title}
      />
    </div>
  );
};

type NoList = Omit<TList, "id"> & { id: null };

const makeColumns = (
  lists: Array<TList | NoList> | undefined = [],
  tasks: TTask[] | undefined = [],
): TColumn[] =>
  [{ createdAt: "", id: null, title: "No List" }, ...lists].map(
    (list: TList | NoList) => ({
      autoCollapse: list.id === null,
      id: list.id,
      isEditable: list.id !== null,
      title: list.title,
      emoji: list.emoji,
      tasks: tasks?.filter((task: TTask) => task.listId === list.id),
    }),
  );
