import classNames from "classnames";

type TTooltipProps = {
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
  position?: "top" | "bottom" | "left" | "right";
  text: string;
};

export const Tooltip = ({
  children,
  className,
  enabled = true,
  position = "bottom",
  text,
}: TTooltipProps) => {
  if (!enabled) {
    return <div>{children}</div>;
  }

  return (
    <div
      className={classNames(
        "tooltip z-100",
        {
          "tooltip-right": position === "right",
          "tooltip-left": position === "left",
          "tooltip-top": position === "top",
          "tooltip-bottom": position === "bottom",
        },
        className,
      )}
      data-tip={text}
    >
      {children}
    </div>
  );
};
