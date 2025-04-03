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
