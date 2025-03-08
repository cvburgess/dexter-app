import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import emojiData from "@emoji-mart/data" with { type: "json" };
import EmojiPicker from "@emoji-mart/react";

import { Board, TColumn } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { useAuth } from "../hooks/useAuth.tsx";
import { useLists } from "../hooks/useLists.tsx";

import { TCreateList, TList } from "../api/lists.ts";
import { getTasks, TTask } from "../api/tasks.ts";

export const Lists = () => {
  const { supabase } = useAuth();
  const [lists, { createList }] = useLists();

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  const columns = makeColumns(lists, tasks);

  return (
    <View className="flex gap-4">
      <Board
        canCreateTasks
        columns={columns}
        groupBy="listId"
      />
      <CreateList onListCreate={createList} />
    </View>
  );
};

type TCreateListProps = {
  onListCreate: (list: TCreateList) => void;
};

const CreateList = ({ onListCreate }: TCreateListProps) => {
  const [emoji, setEmoji] = useState<string>("🐶");

  return (
    <div className="join w-80 shadow-sm rounded-lg h-[42px] min-w-80">
      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className="btn rounded-l-lg join-item border-base-100 bg-base-100 h-full"
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
        className="input join-item bg-base-100 border-base-100 focus:outline-none shadow-none focus:shadow-none rounded-r-lg h-full"
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
