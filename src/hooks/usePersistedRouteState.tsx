import { useLocation } from "react-router";
import { useLocalStorage } from "@uidotdev/usehooks";

type TUsePersistedRouteState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export const usePersistedRouteState = <T,>(
  keyName: string,
  defaultValue: T,
): TUsePersistedRouteState<T> => {
  const { pathname } = useLocation();

  const key = `${keyName}:${pathname}`;
  const [value, setValue] = useLocalStorage<T>(key, defaultValue);

  return [value, setValue];
};
