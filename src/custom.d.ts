// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
("csstype");

declare module "react" {
  interface ButtonHTMLAttributes {
    popovertarget?: string;
    popovertargetaction?: "hide" | "show" | "toggle"; // lowercase variant
  }

  interface HTMLAttributes {
    popover?: "auto" | "manual";
  }

  interface HTMLAttributes {
    popover?: "auto" | "manual";
  }
}

// PWA Badge API types
declare global {
  interface Navigator {
    setAppBadge(contents?: number): Promise<void>;
    clearAppBadge(): Promise<void>;
  }

  interface SyncManager {
    register(tag: string): Promise<void>;
  }
}
