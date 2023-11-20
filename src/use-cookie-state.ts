import cookie from "cookie";
import { useState } from "react";

export type Encode = cookie.CookieSerializeOptions;
export type Decode = cookie.CookieParseOptions;

type Options = { decode?: Decode; encode?: Encode };

type GetCookieValue<T> = {
  key: string;
  cookies: string;
  options: Decode | undefined;
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

const defaultEncode: Encode = { path: "/", expires: new Date("9999") };

export function useCookieState<T = string>(
  key: string,
  initialValue: T,
  options?: Options
): [T, (value: T, encode?: Encode) => void] {
  const getInitialValue = (): T => {
    const defaultValue =
      typeof initialValue === "function" ? initialValue() : initialValue;

    if (typeof window === "undefined") return defaultValue;

    return getCookieValue({
      key,
      cookies: document.cookie,
      options: options?.decode,
      defaultValue,
    }) as T;
  };

  const [value, setValue] = useState<T>(getInitialValue);

  const setNextValue = (value: T, encode?: Encode) => {
    const stringified =
      typeof value === "string" ? value : JSON.stringify(value);

    document.cookie = cookie.serialize(
      key,
      stringified,
      Object.assign({}, defaultEncode, options?.encode, encode)
    );

    setValue(value);
  };

  return [value, setNextValue];
}
