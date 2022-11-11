import { z } from "zod";
import { createUserSettingsHook, localStorageStore } from "./hooks/useUserSettings";

const useUserSettings = createUserSettingsHook(localStorageStore);

export const CountWithHooks = () => {
  const countSchema = z.object({
    count: z.number().int().min(0),
  })

  const [countUserSettings, setCountUserSettings] = useUserSettings({
    key: 'countHook',
    schema: countSchema,
    defaultValue: { count: 5 },
  });

  return (
    <button onClick={() => {
      setCountUserSettings({count: countUserSettings.count + 1 });
    }}>
      count is {countUserSettings.count}
    </button>
  )
}