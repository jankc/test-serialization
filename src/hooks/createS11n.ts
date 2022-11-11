import { z } from "zod";

interface CreateS11nOptions<T> {
  key: string;
  schema: z.ZodSchema<T>;
  defaultValue: T;
}

export const createS11n = <T>({ key, schema, defaultValue }: CreateS11nOptions<T>) => {
  const serialize = (value: T) => {
    localStorage.setItem(key, JSON.stringify(schema.parse(value)));
  };

  const deserialize = () => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return schema.parse(JSON.parse(item));
      } catch (error) {
        console.error(`Key "${key}" could not be parsed: ${error}`);
      }
    }
    return defaultValue;
  };

  return [serialize, deserialize] as const;
}
