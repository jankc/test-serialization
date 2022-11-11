import { useState } from "react";
import { z } from "zod";


interface SerializedStore {
        useQuery: (key: string) => { data: string  | null };
        mutation: (key: string, data: string) => { data: string };
    }
interface UiSettingsStore<T> {
    key: string;
    schema: z.ZodSchema<T>;
    defaultValue: T;
}

export const localStorageStore:SerializedStore ={
    useQuery: (key) => { 
        const data = localStorage.getItem(key);
        return { data };
    },
    mutation: (key, data) => {
        localStorage.setItem(key, data);
        return { data };
    }
}



export const createUiSettingsHook = (store?: SerializedStore) => 
    <TData>({ key, schema, defaultValue }: UiSettingsStore<TData>) => {
        const [uiSettings, _setUiSettings] = useState<TData>(defaultValue);

        const _store = store ?? localStorageStore;

        const setUiSettings = (value: TData) => {
            try{
                const { data } = _store.mutation(key, JSON.stringify(schema.parse(value)));
                _setUiSettings(value);
            } catch (error) {
                console.error(`Key "${key}" could not be set: ${error}`);
            }
        };

        const { data } = _store.useQuery(key);

        if (data) {
            try {
                const parsedData = schema.parse(JSON.parse(data));
                if (parsedData !== uiSettings) {
                    _setUiSettings(parsedData);
                }
            } catch (error) {
                console.error(`Key "${key}" could not be parsed: ${error}`);
            }
        }
        return [uiSettings, setUiSettings] as const;
}
