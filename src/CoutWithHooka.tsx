import { z } from "zod";
import { createUiSettingsHook, localStorageStore } from "./hooks/useUiSettings";

const useUiSettings = createUiSettingsHook(localStorageStore);

export const CountWithHooks = () => {
    const countSchema = z.number().int().min(0);
    
    const [countUiSettings, setCountUiSettings] = useUiSettings({
        key: 'countHook',
        schema: countSchema,
        defaultValue: 13,
    });

    return (
        <button onClick={() => {
          setCountUiSettings(countUiSettings + 1);
        }}>
          count is {countUiSettings}
        </button>
    )
}