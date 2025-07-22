import { Temporal } from "@js-temporal/polyfill";
import { ETaskPriority } from "../api/tasks";
import { TList } from "../api/lists";

export type TaskShorthandResult = {
  title: string;
  priority?: ETaskPriority;
  listId?: string | null;
  dueOn?: string | null;
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
 * List syntax:
 * - #listname matches list titles (case-insensitive, spaces become hyphens)
 * - example: #my-first-list matches "My First List"
 *
 * Due date syntax:
 * - due:N sets dueOn to N days from today
 * - due:0 = today, due:1 = tomorrow, due:7 = next week
 *
 * @param input - The raw task input from user
 * @param availableLists - Array of available lists for matching
 * @returns Object with parsed title and optional priority/listId/dueOn
 */
/**
 * Helper function to normalize list title for matching
 * Converts "My First List" to "my-first-list"
 */
const normalizeListTitle = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, "-");
};

export const parseTaskShorthand = (
  input: string,
  availableLists: TList[] = [],
): TaskShorthandResult => {
  let workingInput = input.trim();
  let priority: ETaskPriority | undefined;
  let listId: string | null = null;
  let dueOn: string | null = null;

  // Parse priority pattern first: one or more consecutive exclamation marks
  const priorityMatch = workingInput.match(/^(!{1,4})\s*/);
  if (priorityMatch) {
    const exclamationCount = priorityMatch[1].length;
    workingInput = workingInput.replace(priorityMatch[0], "").trim();

    // Map exclamation count to priority enum
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
        // More than 4 exclamations, don't parse priority
        workingInput = input.trim();
        priority = undefined;
        break;
    }
  }

  // Parse list pattern: #listname
  const listMatch = workingInput.match(/#([a-zA-Z0-9-]+)(?:\s|$)/);
  if (listMatch && availableLists.length > 0) {
    const listShorthand = listMatch[1]; // Extract the part after #

    // Find matching list by normalized title
    const matchingList = availableLists.find(
      (list) => normalizeListTitle(list.title) === listShorthand,
    );

    if (matchingList) {
      listId = matchingList.id;
      // Remove the list shorthand from the working input
      workingInput = workingInput.replace(listMatch[0], "").trim();
    }
  }

  // Parse due date pattern: due:N where N is number of days from today
  const dueDateMatch = workingInput.match(/due:(\d+)(?:\s|$)/);
  if (dueDateMatch) {
    const daysFromNow = parseInt(dueDateMatch[1], 10);
    const today = Temporal.Now.plainDateISO();
    dueOn = today.add({ days: daysFromNow }).toString();
    // Remove the due date shorthand from the working input
    workingInput = workingInput.replace(dueDateMatch[0], "").trim();
  }

  const title = workingInput.trim();

  // Don't parse shorthand if title would be empty
  if (!title) {
    return { title: input.trim() };
  }

  return {
    title,
    ...(priority !== undefined && { priority }),
    ...(listId !== null && { listId }),
    ...(dueOn !== null && { dueOn }),
  };
};
