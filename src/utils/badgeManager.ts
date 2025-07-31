import { Temporal } from "@js-temporal/polyfill";
import { ETaskStatus, TTask } from "../api/tasks";

export class BadgeManager {
  private static instance: BadgeManager;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): BadgeManager {
    if (!BadgeManager.instance) {
      BadgeManager.instance = new BadgeManager();
    }
    return BadgeManager.instance;
  }

  /**
   * Initialize the badge manager with service worker registration
   */
  public async init(): Promise<void> {
    // Only initialize for web environment, not electron
    if (window.electron) {
      return;
    }

    try {
      // Wait for service worker to be ready
      this.serviceWorkerRegistration = await navigator.serviceWorker.ready;
      console.log("BadgeManager: Service worker ready");
    } catch (error) {
      console.error("BadgeManager: Error initializing service worker:", error);
    }
  }

  /**
   * Update badge with specific count
   */
  public updateBadge(count: number): void {
    if (!this.serviceWorkerRegistration || window.electron) {
      return;
    }

    this.serviceWorkerRegistration.active?.postMessage({
      type: "UPDATE_BADGE",
      data: { count },
    });
  }

  /**
   * Calculate and update badge with today's incomplete tasks
   */
  public updateBadgeFromTasks(tasks: TTask[]): void {
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

    this.updateBadge(incompleteTodayTasks.length);
  }

  /**
   * Clear the badge
   */
  public clearBadge(): void {
    this.updateBadge(0);
  }
}

// Export singleton instance
export const badgeManager = BadgeManager.getInstance();
