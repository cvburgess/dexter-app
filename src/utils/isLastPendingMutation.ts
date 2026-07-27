import { MutationKey, QueryClient } from "@tanstack/react-query";

// True when the mutation running this callback is the only one left for its
// key. Optimistic writers use it to decide whether their result is still the
// freshest thing to put in the cache: `onMutate` fires the moment `mutate` is
// called, so a queued newer save can already have folded its value in while an
// older one is still settling, and writing the older response (or rolling it
// back) would undo it.
//
// React Query flips a mutation out of `pending` only after its `onSuccess` /
// `onError` / `onSettled` callbacks resolve, so the caller is included in this
// count — hence 1, not 0.
export const isLastPendingMutation = (
  queryClient: QueryClient,
  mutationKey: MutationKey,
) => queryClient.isMutating({ mutationKey }) === 1;
