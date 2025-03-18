import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { Board, TColumn } from "../components/Board.tsx";
import { ButtonWithPopover } from "../components/ButtonWithPopover.tsx";
import { Toolbar } from "../components/Toolbar.tsx";
import { View } from "../components/View.tsx";

import { useLists } from "../hooks/useLists.tsx";
import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

import { TCreateList, TList, TUpdateList } from "../api/lists.ts";
import { TTask } from "../api/tasks.ts";

export const Lists = () => {
  const [lists, { createList, updateList }] = useLists();
  const [tasks] = useTasks(taskFilters.incomplete);

  const columns = makeColumns(lists, tasks, updateList);

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
  const [emoji, setEmoji] = useState<string>(list?.emoji || "🐶");
  const [debouncedTitle] = useDebounce(title, 1000);

  useEffect(() => {
    if (list && debouncedTitle !== list.title) {
      onChange({ id: list.id, title: debouncedTitle });
    }
  }, [debouncedTitle]);

  const onChangeTitle = ({
    currentTarget: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (list) onChange({ id: list.id, title: value });
    setTitle(value);
  };

  const onChangeEmoji = (value: string) => {
    if (list) onChange({ id: list.id, emoji: value });
    setEmoji(value);
  };

  // Font Size of 1rem chosen to match a large badge in DaisyUI
  // https://github.com/saadeghi/daisyui/blob/master/packages/daisyui/src/components/badge.css#L109
  return (
    <div className="join min-w-standard h-standard mb-4 sticky top-0">
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
        onChange={onChangeTitle}
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
  updateList: (list: TUpdateList) => void,
): TColumn[] =>
  [{ createdAt: "", id: null, title: "No List" }, ...lists].map(
    (list: TList | NoList) => ({
      autoCollapse: list.id === null,
      id: list.id,
      title: list.title,
      titleComponent: list.id && (
        <ListInput list={list} onChange={updateList} />
      ),
      tasks: tasks?.filter((task: TTask) => task.listId === list.id),
    }),
  );
