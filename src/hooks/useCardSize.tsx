import { ECardSize } from "../components/Card";

import { usePersistedRouteState } from "./usePersistedRouteState";

type TUseCardSize = [ECardSize, () => void];

export const useCardSize = (defaultCardSize: ECardSize): TUseCardSize => {
  const [cardSize, setCardSize] = usePersistedRouteState<ECardSize>(
    "cardSize",
    defaultCardSize,
  );

  const toggleCardSize = () =>
    setCardSize(
      cardSize === ECardSize.STANDARD ? ECardSize.COMPACT : ECardSize.STANDARD,
    );

  return [cardSize, toggleCardSize];
};
