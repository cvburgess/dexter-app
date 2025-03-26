import classNames from "classnames";

type TInputWithIconProps = {
  children: React.ReactNode;
  wrapperClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputWithIcon = ({
  children,
  wrapperClassName,
  ...props
}: TInputWithIconProps) => (
  <label
    className={classNames(
      "group input input-ghost w-full p-4 bg-base-200",
      "focus-within:bg-base-100 focus-within:border-1 focus-within:border-base-300 focus-within:outline-none",
      wrapperClassName,
    )}
  >
    {children}
    <input {...props} />
  </label>
);
