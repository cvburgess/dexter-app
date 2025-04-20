import { useLocation } from "react-router";
import { useLocalStorage } from "@uidotdev/usehooks";

import { ECardSize } from "../components/Card";

type TUseCardSize = [ECardSize, () => void];

export const useCardSize = (defaultCardSize: ECardSize): TUseCardSize => {
  const { pathname } = useLocation();
  // Treat web as fullscreen because it has no window chrome
  const [cardSize, setCardSize] = useLocalStorage<ECardSize>(
    `cardSize:${pathname}`,
    defaultCardSize,
  );

  const toggleCardSize = () =>
    setCardSize(
      cardSize === ECardSize.STANDARD ? ECardSize.COMPACT : ECardSize.STANDARD,
    );

  return [cardSize, toggleCardSize];
};
