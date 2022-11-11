import { useState } from "react";
import { z } from "zod";

interface SerializedStore<TError extends Error = Error> {
  useQuery: (key: string) => {
    data?: string,
    error?: TError
  };
  mutation: (key: string, data: string) => {
    data: string,
    error?: TError
  };
}

interface UserSettingsStore<T> {
  key: string;
  schema: z.ZodSchema<T>;
  defaultValue: T;
}

export const localStorageStore: SerializedStore = {
  useQuery: (key) => {
    const data = localStorage.getItem(key) ?? undefined;
    return { data };
  },
  mutation: (key, data) => {
    localStorage.setItem(key, data);
    return { data };
  }
}

export const createUserSettingsHook = (store?: SerializedStore) =>
  <TData extends Record<string, unknown>>({ key, schema, defaultValue }: UserSettingsStore<TData>) => {

    const _store = store ?? localStorageStore;

    const { data, error } = _store.useQuery(key);

    if (error) {
      console.error(`Key "${key}" could not be fetched: ${error}`);
    }

    let parsedData;
    if (data && !error) {
      try {
        parsedData = schema.parse(JSON.parse(data));
      } catch (error) {
        console.error(`Key "${key}" could not be parsed: ${error}`);
      }
    }

    const [userSettings, _setUserSettings] = useState<TData>(parsedData ?? defaultValue);

    const setUserSettings = (value: Partial<TData>) => {
      const newValue = { ...userSettings, ...value };
      try {
        const { data } = _store.mutation(key, JSON.stringify(schema.parse(newValue)));
        // return data can be parsed and used to update state instead of newValue

        // This (and the whole useState) might not be necassary if this mutation invalidates the query and makes it to re-run
        _setUserSettings(newValue);
      } catch (error) {
        console.error(`Key "${key}" could not be set: ${error}`);
      }
    };

    return [userSettings, setUserSettings] as const;
  }
