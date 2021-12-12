import cookie from "cookie";
import { useState } from "react";

type GetCookieValue<T> = {
  key: string;
  cookies: string;
  options: cookie.CookieParseOptions | undefined;
  defaultValue: T;
};

function getCookieValue<T>({
  key,
  cookies,
  options,
  defaultValue,
}: GetCookieValue<T>): string | T {
  const value = cookie.parse(cookies || "", options);

  return value[key] ?? defaultValue;
}

type Options = {
  decodeOps?: cookie.CookieParseOptions;
  encodeOps?: cookie.CookieSerializeOptions;
};

export function useCookieState<T = string>(
  key: string,
  initialValue: T,
  options: Options = { encodeOps: { path: "/", expires: new Date("10000") } }
): [T, (value: T) => void] {
  const getInitialValue = (): T => {
    const defaultValue =
      typeof initialValue === "function" ? initialValue() : initialValue;

    if (typeof window === "undefined") return defaultValue;

    return getCookieValue({
      key,
      cookies: document.cookie,
      options: options?.decodeOps,
      defaultValue,
    }) as T;
  };

  const [value, setValue] = useState<T>(getInitialValue);

  const setNextValue = (value: any) => {
    document.cookie = cookie.serialize(key, value, options?.encodeOps);
    setValue(value);
  };

  return [value, setNextValue];
}
