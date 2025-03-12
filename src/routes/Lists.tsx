import { useState } from "react";
import emojiData from "@emoji-mart/data" with { type: "json" };
import EmojiPicker from "@emoji-mart/react";

import { Board, TColumn } from "../components/Board.tsx";
import { QuickPlanner } from "../components/QuickPlanner.tsx";
import { View } from "../components/View.tsx";

import { useLists } from "../hooks/useLists.tsx";
import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

import { TCreateList, TList } from "../api/lists.ts";
import { TTask } from "../api/tasks.ts";

export const Lists = () => {
  const [lists, { createList }] = useLists();
  const [tasks] = useTasks(taskFilters.incomplete);

  const columns = makeColumns(lists, tasks);

  return (
    <View className="flex gap-4">
      <Board
        canCreateTasks
        columns={columns}
        groupBy="listId"
      />
      <CreateList onListCreate={createList} />
      <QuickPlanner />
    </View>
  );
};

type TCreateListProps = {
  onListCreate: (list: TCreateList) => void;
};

const CreateList = ({ onListCreate }: TCreateListProps) => {
  const [emoji, setEmoji] = useState<string>("🐶");

  return (
    <div className="join w-70 min-w-70 h-[42px] shadow-sm rounded-[var(--radius-box)]">
      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className="btn rounded-l-[var(--radius-box)] join-item border-base-100 bg-base-100 h-full shadow-none"
        >
          {emoji}
        </div>
        <div className="dropdown-content shadow-sm mt-2">
          <EmojiPicker
            data={emojiData}
            maxFrequentRows={0}
            onEmojiSelect={(emoji: { native: string }) =>
              setEmoji(emoji.native)}
            previewEmoji="dog"
          />
        </div>
      </div>
      <input
        className="input join-item bg-base-100 border-base-100 focus:outline-none shadow-none focus:shadow-none rounded-r-[var(--radius-box)] h-full"
        placeholder="New List"
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value.trim()) {
            onListCreate({ title: e.currentTarget.value.trim(), emoji });
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};

const makeColumns = (
  lists: TList[] | undefined = [],
  tasks: TTask[] | undefined = [],
): TColumn[] =>
  lists.map((list: TList) => ({
    id: list.id,
    title: list.title,
    emoji: list.emoji,
    tasks: tasks?.filter((task: TTask) => task.listId === list.id),
  }));
