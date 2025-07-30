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
  public async init(supabaseUrl?: string): Promise<void> {
    // Only initialize for web environment, not electron
    if (window.electron) {
      return;
    }

    try {
      // Wait for service worker to be ready
      this.serviceWorkerRegistration = await navigator.serviceWorker.ready;
      console.log("BadgeManager: Service worker ready");

      // Send Supabase URL to service worker
      if (supabaseUrl) {
        this.serviceWorkerRegistration.active?.postMessage({
          type: "SET_SUPABASE_URL",
          data: { url: supabaseUrl },
        });
      }
    } catch (error) {
      console.error("BadgeManager: Error initializing service worker:", error);
    }
  }

  /**
   * Set auth token in service worker for API calls
   */
  public setAuthToken(token: string): void {
    if (!this.serviceWorkerRegistration || window.electron) {
      return;
    }

    this.serviceWorkerRegistration.active?.postMessage({
      type: "SET_AUTH_TOKEN",
      data: { token },
    });
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

  /**
   * Get today's tasks count from service worker
   */
  public async getTodayTasksCount(): Promise<number> {
    if (!this.serviceWorkerRegistration || window.electron) {
      return 0;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === "TODAY_TASKS_COUNT") {
          resolve(event.data.count);
        }
      };

      this.serviceWorkerRegistration?.active?.postMessage(
        { type: "GET_TODAY_TASKS_COUNT" },
        [messageChannel.port2],
      );

      // Fallback timeout
      setTimeout(() => resolve(0), 5000);
    });
  }

  /**
   * Trigger background sync for badge update
   */
  public triggerBackgroundUpdate(): void {
    if (!this.serviceWorkerRegistration || window.electron) {
      return;
    }

    // Request background sync if available
    if ("sync" in this.serviceWorkerRegistration) {
      const registration = this
        .serviceWorkerRegistration as ServiceWorkerRegistration & {
        sync: SyncManager;
      };
      registration.sync.register("update-badge").catch(console.error);
    }
  }
}

// Export singleton instance
export const badgeManager = BadgeManager.getInstance();
