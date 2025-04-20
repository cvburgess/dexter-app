import { useState } from "react";

import { ECardSize } from "../components/Card";

type TUseCardSize = [ECardSize, () => void];

export const useCardSize = (defaultCardSize: ECardSize): TUseCardSize => {
  // Treat web as fullscreen because it has no window chrome
  const [cardSize, setCardSize] = useState<ECardSize>(defaultCardSize);

  const toggleCardSize = () =>
    setCardSize(
      cardSize === ECardSize.STANDARD ? ECardSize.COMPACT : ECardSize.STANDARD,
    );

  return [cardSize, toggleCardSize];
};
