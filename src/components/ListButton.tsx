import { Smiley } from "@phosphor-icons/react";

import { ButtonWithPopover, TOption } from "./ButtonWithPopover.tsx";

import { useLists } from "../hooks/useLists.tsx";

import { TList } from "../api/lists.ts";
import { TUpdateTask } from "../api/tasks.ts";

type TListButtonProps = {
  listId: string | null;
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
};

export const ListButton = ({ onTaskUpdate, listId }: TListButtonProps) => {
  const [lists, { getListById }] = useLists();

  const selectedList = listId ? getListById(listId) : null;

  const options = optionsForListId(lists, listId);

  return (
    <ButtonWithPopover
      buttonVariant="round"
      onChange={(value) => onTaskUpdate({ listId: value })}
      options={options}
      variant="menu"
      wrapperClassName="dropdown-center dropdown-hover"
    >
      {selectedList ? selectedList.emoji : <Smiley weight="thin" size={24} />}
    </ButtonWithPopover>
  );
};

const optionsForListId = (lists: TList[], listId: string | null): TOption[] =>
  [...lists, {
    id: null,
    title: "None",
    emoji: "🚫",
    isSelected: listId === null,
  }].map((list) => ({
    id: list.id,
    title: list.title,
    emoji: list.emoji,
    isSelected: list.id === listId,
  }));
