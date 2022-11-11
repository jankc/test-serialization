import { z } from "zod";
import { useUiSettings } from "./hooks/useUiSettings";

export const CountWithHooks = () => {
    const countSchema = z.number().int().min(0);
    
    const [countUiSettings, setCountUiSettings] = useUiSettings({
        key: 'countHook',
        schema: countSchema,
        defaultValue: 5,
    });

    return (
        <button onClick={() => {
          setCountUiSettings(countUiSettings + 1);
        }}>
          count is {countUiSettings}
        </button>
    )
}