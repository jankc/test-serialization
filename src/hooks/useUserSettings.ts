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

interface UserSettingssStore<T> {
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

export const createUserSettingssHook = (store?: SerializedStore) =>
  <TData>({ key, schema, defaultValue }: UserSettingssStore<TData>) => {
    const [userSettingss, _setUserSettingss] = useState<TData>(defaultValue);

    const _store = store ?? localStorageStore;

    const setUserSettingss = (value: TData) => {
      try {
        const { data } = _store.mutation(key, JSON.stringify(schema.parse(value)));
        
        // May not be necassary if the mutation invalidates the query
        _setUserSettingss(value);
      } catch (error) {
        console.error(`Key "${key}" could not be set: ${error}`);
      }
    };

    const { data, error } = _store.useQuery(key);

    if (error) {
      console.error(`Key "${key}" could not be fetched: ${error}`);
    }

    if (data && !error) {
      try {
        const parsedData = schema.parse(JSON.parse(data));
        if (parsedData !== userSettingss) {
          _setUserSettingss(parsedData);
        }
      } catch (error) {
        console.error(`Key "${key}" could not be parsed: ${error}`);
      }
    }
    return [userSettingss, setUserSettingss] as const;
  }
