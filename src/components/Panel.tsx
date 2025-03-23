export const Panel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-2 border-base-200 w-full h-[calc(100vh-5.5rem)] rounded-box mt-4 p-4 overflow-auto">
      {children}
    </div>
  );
};
