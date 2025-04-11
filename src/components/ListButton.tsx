import { Smiley } from "@phosphor-icons/react";

import { ButtonWithPopover, TOption } from "./ButtonWithPopover.tsx";
import { Tooltip } from "./Tooltip.tsx";

import { useLists } from "../hooks/useLists.tsx";

import { TList } from "../api/lists.ts";
import { TTask, TUpdateTask } from "../api/tasks.ts";

type TListButtonProps = {
  listId: string | null;
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  task: TTask;
};

export const ListButton = ({
  onTaskUpdate,
  listId,
  task,
}: TListButtonProps) => {
  const [lists, { getListById }] = useLists();

  const selectedList = listId ? getListById(listId) : null;

  const options = optionsForListId(lists, listId);

  return (
    <Tooltip position="top" text="List">
      <ButtonWithPopover
        buttonVariant="round"
        onChange={(value) => onTaskUpdate({ listId: value as string })}
        options={options}
        popoverId={`${task.id}-list`}
        variant="menu"
      >
        {selectedList ? selectedList.emoji : <Smiley size={24} weight="thin" />}
      </ButtonWithPopover>
    </Tooltip>
  );
};

const optionsForListId = (lists: TList[], listId: string | null): TOption[] =>
  [
    ...lists,
    { id: null, title: "None", emoji: "🚫", isSelected: listId === null },
  ].map((list) => ({
    id: list.id,
    title: list.title,
    emoji: list.emoji,
    isSelected: list.id === listId,
  }));
