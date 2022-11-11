import { z } from "zod";
import { createUserSettingssHook, localStorageStore } from "./hooks/useUserSettings";

const useUserSettingss = createUserSettingssHook(localStorageStore);

export const CountWithHooks = () => {
  const countSchema = z.number().int().min(0);

  const [countUserSettingss, setCountUserSettingss] = useUserSettingss({
    key: 'countHook',
    schema: countSchema,
    defaultValue: 13,
  });

  return (
    <button onClick={() => {
      setCountUserSettingss(countUserSettingss + 1);
    }}>
      count is {countUserSettingss}
    </button>
  )
}