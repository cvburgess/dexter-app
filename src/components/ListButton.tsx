import { Smiley } from "@phosphor-icons/react";

import { ButtonWithPopover, TOption } from "./ButtonWithPopover.tsx";

import { useLists } from "../hooks/useLists.tsx";

import { TList } from "../api/lists.ts";
import { TTask, TUpdateTask } from "../api/tasks.ts";
import { TTemplate, TUpdateTemplate } from "../api/templates.ts";

type TCommonProps = {
  listId: string | null;
};

type TConditionalProps =
  | {
      onUpdate: (diff: Omit<TUpdateTask, "id">) => void;
      task: TTask;
    }
  | {
      onUpdate: (diff: Omit<TUpdateTemplate, "id">) => void;
      template: TTemplate;
    };

type TListButtonProps = TCommonProps & TConditionalProps;

export const ListButton = ({
  onUpdate,
  listId,
  ...props
}: TListButtonProps) => {
  const [lists, { getListById }] = useLists();

  const taskOrTemplate = "task" in props ? props.task : props.template;

  const selectedList = listId ? getListById(listId) : null;

  const options = optionsForListId(lists, listId);

  return (
    <ButtonWithPopover
      buttonVariant="round"
      onChange={(value) => onUpdate({ listId: value as string })}
      options={options}
      popoverId={`${taskOrTemplate.id}-list`}
      title="List"
      variant="menu"
    >
      {selectedList ? selectedList.emoji : <Smiley size={24} weight="thin" />}
    </ButtonWithPopover>
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
