import { ETaskPriority } from "../api/tasks";

export type TaskShorthandResult = {
  title: string;
  priority?: ETaskPriority;
};

/**
 * Parses shorthand syntax from task title when creating new tasks.
 *
 * Priority syntax:
 * - ! = URGENT (1)
 * - !! = IMPORTANT (2)
 * - !!! = IMPORTANT_AND_URGENT (0)
 * - !!!! = NEITHER (3)
 *
 * @param input - The raw task input from user
 * @returns Object with parsed title and optional priority
 */
export const parseTaskShorthand = (input: string): TaskShorthandResult => {
  const trimmedInput = input.trim();

  // Match priority pattern: one or more consecutive exclamation marks
  const priorityMatch = trimmedInput.match(/^(!{1,4})\s*/);

  if (!priorityMatch) {
    return { title: trimmedInput };
  }

  const exclamationCount = priorityMatch[1].length;
  const title = trimmedInput.replace(priorityMatch[0], "").trim();

  // Map exclamation count to priority enum
  let priority: ETaskPriority;
  switch (exclamationCount) {
    case 1:
      priority = ETaskPriority.URGENT; // 1
      break;
    case 2:
      priority = ETaskPriority.IMPORTANT; // 2
      break;
    case 3:
      priority = ETaskPriority.IMPORTANT_AND_URGENT; // 0
      break;
    case 4:
      priority = ETaskPriority.NEITHER; // 3
      break;
    default:
      // More than 4 exclamations, treat as regular title
      return { title: trimmedInput };
  }

  // Don't set priority if title is empty after removing shorthand
  if (!title) {
    return { title: trimmedInput };
  }

  return { title, priority };
};
