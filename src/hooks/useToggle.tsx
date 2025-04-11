import { useEffect, useState } from "react";

type TUseToggle = [boolean, () => void];

export const useToggle = (startOpen = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(startOpen);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Add the event listener
    const removeListener = window.electron?.onToggleQuickPlanner(toggle);

    // Clean up the event listener when the component unmounts
    return () => {
      if (removeListener) removeListener();
    };
  }, [toggle]);

  return [isOpen, toggle] as TUseToggle;
};
