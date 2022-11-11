import { useState } from "react";
import { z } from "zod";


interface Store<T> {
        useQuery: (key: string) => {data: T};
        mutation: (kay: string, data: T) => {data: T};
    }
interface UiSettings<T> {
    key: string;
    schema: z.ZodSchema<T>;
    defaultValue: T;
    store?: Store<T>;
}

const localStorageStore = <T>(): Store<T> => ({
    useQuery: (key) => { 
        let data;
        try {
            data = JSON.parse(localStorage.getItem(key) ?? '');
        } catch (error) {
            console.error(`Key "${key}" could not be retrieved: ${error}`);
        }
        return {data};
    },
    mutation: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
        return {data};
    }
})

export const useUiSettings = <T>({ key, schema, defaultValue, store: _store }: UiSettings<T>) => {
    const [uiSettings, _setUiSettings] = useState<T>(defaultValue);

    const store = _store ?? localStorageStore<T>();

    const setUiSettings = (value: T) => {
        const { data } = store.mutation(key, schema.parse(value));
        if (data) _setUiSettings(data);
    };

    const {data} = store.useQuery(key);
    
    if (data) {
        try {
            const parsedData = schema.parse(data);
            if (parsedData !== uiSettings) {
                _setUiSettings(parsedData);
            }
        } catch (error) {
            console.error(`Key "${key}" could not be parsed: ${error}`);
        }
    }
    return [uiSettings, setUiSettings] as const;
}
