import { Temporal } from "@js-temporal/polyfill";
import { ETaskStatus, TTask } from "../api/tasks";

/**
 * Update badge with specific count using direct API call
 */
async function updateBadge(count: number): Promise<void> {
  // Only work in web environment, not electron
  if (window.electron) {
    return;
  }

  try {
    if ("setAppBadge" in navigator) {
      if (count > 0) {
        await navigator.setAppBadge(count);
        console.log(`Badge: Updated to ${count}`);
      } else {
        await navigator.clearAppBadge();
        console.log("Badge: Cleared");
      }
    } else {
      console.log("Badge: setAppBadge not supported");
    }
  } catch (error) {
    console.error("Badge: Error updating badge:", error);
  }
}

/**
 * Calculate and update badge with today's incomplete tasks
 */
export function updateBadgeFromTasks(tasks: TTask[]): void {
  if (window.electron) {
    return;
  }

  const today = Temporal.Now.plainDateISO().toString();
  const incompleteTodayTasks = tasks.filter(
    (task) =>
      task.scheduledFor === today &&
      (task.status === ETaskStatus.TODO ||
        task.status === ETaskStatus.IN_PROGRESS),
  );

  updateBadge(incompleteTodayTasks.length);
}

/**
 * Clear the badge
 */
export function clearBadge(): void {
  updateBadge(0);
}
