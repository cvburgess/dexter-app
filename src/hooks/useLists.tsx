import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createList, getLists, TCreateList, TList } from "../api/lists.ts";

import { useAuth } from "./useAuth.tsx";

type TUseLists = [
  TList[],
  {
    createList: (list: TCreateList) => void;
    getListById: (id: string | null) => TList | undefined;
  },
];
export const useLists = (): TUseLists => {
  const { supabase } = useAuth();
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

  const getListById = (id: string | null) => {
    if (!id) return undefined;
    return lists?.find((list) => list.id === id);
  };

  return [lists, { createList: create, getListById }];
};
