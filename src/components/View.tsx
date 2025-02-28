type Props = {
  children: React.ReactNode;
  className?: string;
};

export const View = ({ children, className }: Props) => (
  <div className={`flex-1 overflow-auto w-full ${className}`}>
    {children}
  </div>
);
