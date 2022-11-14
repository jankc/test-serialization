import { z } from "zod";
import { createUserSettingsHook, localStorageStore } from "./hooks/useUserSettings";

const useUserSettings = createUserSettingsHook(localStorageStore);

const CountSettings = z.object({
  count: z.number().int().min(0),
})

type CountSettings = z.infer<typeof CountSettings>;

export const CountWithHooks = () => {

  const [countUserSettings, setCountUserSettings] = useUserSettings({
    key: 'countHook',
    validate: (value): value is CountSettings => {
      const { success } = CountSettings.safeParse(value);
      return success;
    },
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