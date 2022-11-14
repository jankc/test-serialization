import { useState } from "react";

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
  defaultValue: T;
  validate?: (value: unknown) => value is T;
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
  <TData extends Record<string, unknown>>({
    key,
    defaultValue,
    validate = (value): value is TData => true
  }: UserSettingsStore<TData>) => {

    const _store = store ?? localStorageStore;

    const { data, error } = _store.useQuery(key);

    if (error) {
      console.error(`Key "${key}" could not be fetched: ${error}`);
    }

    let validatedData = defaultValue;
    if (data && !error) {
      try {
        const parsedData = JSON.parse(data);
        if (validate(parsedData)) {
          validatedData = parsedData;
        } else {
          throw new Error(`Key "${key}" could not be parsed`);
        }
      } catch (error) {
        console.error(`Key "${key}" could not be parsed: ${error}`);
      }
    }

    const [userSettings, _setUserSettings] = useState<TData>(validatedData);

    const setUserSettings = (value: Partial<TData>) => {
      const newValue = { ...userSettings, ...value };
      try {
        const { data } = _store.mutation(key, JSON.stringify(newValue));
        // return data can be parsed and used to update state instead of newValue

        // This (and the whole useState) might not be necassary if this mutation invalidates the query and makes it to re-run
        _setUserSettings(newValue);
      } catch (error) {
        console.error(`Key "${key}" could not be set: ${error}`);
      }
    };

    return [userSettings, setUserSettings] as const;
  }
