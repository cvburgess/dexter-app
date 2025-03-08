import { useQuery } from "@tanstack/react-query";

import { getLists, TList } from "../api/lists.ts";

import { useAuth } from "./useAuth.tsx";

type TUseLists = [
  TList[],
  (id?: string) => TList | undefined,
];
export const useLists = (): TUseLists => {
  const { supabase } = useAuth();

  const { data: lists = [] } = useQuery({
    queryKey: ["lists"],
    queryFn: () => getLists(supabase),
  });

  const getListById = (id?: string) => {
    if (!id) return undefined;
    return lists?.find((list) => list.id === id);
  };

  return [lists, getListById];
};
