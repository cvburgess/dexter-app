import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const View = ({ children, className }: Props) => (
  <div className={classNames("flex-1 overflow-auto w-full p-4", className)}>
    {children}
  </div>
);
