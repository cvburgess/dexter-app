import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createList,
  deleteList,
  getLists,
  TCreateList,
  TList,
  TUpdateList,
  updateList,
} from "../api/lists.ts";

import { supabase } from "./useAuth.tsx";

type TUseLists = [
  TList[],
  {
    createList: (list: TCreateList) => void;
    deleteList: (id: string) => void;
    getListById: (id: string | null) => TList | undefined;
    updateList: (list: TUpdateList) => void;
  },
];

export const useLists = (): TUseLists => {
  const queryClient = useQueryClient();

  const { data: lists = [] } = useQuery({
    queryKey: ["lists"],
    queryFn: () => getLists(supabase),
  });

  const { mutate: create } = useMutation<TList[], Error, TCreateList>({
    mutationFn: ({ title, emoji }) => createList(supabase, { title, emoji }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  const { mutate: update } = useMutation<TList[], Error, TUpdateList>({
    mutationFn: (diff) => updateList(supabase, diff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  const { mutate: remove } = useMutation<void, Error, string>({
    mutationFn: (id) => deleteList(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  const getListById = (id: string | null) => {
    if (!id) return undefined;
    return lists?.find((list) => list.id === id);
  };

  return [
    lists,
    { createList: create, deleteList: remove, getListById, updateList: update },
  ];
};
