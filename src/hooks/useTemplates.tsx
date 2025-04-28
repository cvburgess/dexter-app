import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "./useAuth.tsx";

import {
  createTemplate,
  deleteTemplate,
  getTemplates,
  TCreateTemplate,
  TTemplate,
  TUpdateTemplate,
  updateTemplate,
} from "../api/templates.ts";

type TUseTemplates = [
  TTemplate[],
  {
    createTemplate: (template: TCreateTemplate) => void;
    deleteTemplate: (id: string) => void;
    updateTemplate: (template: TUpdateTemplate) => void;
  },
];

type TUseTemplatesOptions = {
  skipQuery?: boolean;
};

export const useTemplates = (options?: TUseTemplatesOptions): TUseTemplates => {
  const queryClient = useQueryClient();

  const { data: templates = [] } = useQuery({
    enabled: !options?.skipQuery,
    queryKey: ["templates"],
    queryFn: () => getTemplates(supabase),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const { mutate: create } = useMutation<TTemplate, Error, TCreateTemplate>({
    mutationFn: (template) => createTemplate(supabase, template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  const { mutate: update } = useMutation<TTemplate, Error, TUpdateTemplate>({
    mutationFn: (diff) => updateTemplate(supabase, diff),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });

  const { mutate: remove } = useMutation<void, Error, string>({
    mutationFn: (id) => deleteTemplate(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  return [
    templates,
    {
      createTemplate: create,
      deleteTemplate: remove,
      updateTemplate: update,
    },
  ];
};
