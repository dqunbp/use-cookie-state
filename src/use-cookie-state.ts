import * as cookie from "cookie";
import { useState } from "react";

export type Encode = cookie.SerializeOptions;
export type Decode = (value: string) => any;

type Options = { decode?: Decode; encode?: Encode };

type GetCookieValue<T> = {
  key: string;
  cookies: string;
  decode: Decode | undefined;
  defaultValue: T;
};

function getCookieValue<T>({
  key,
  cookies,
  decode,
  defaultValue,
}: GetCookieValue<T>): string | T {
  const allCookies = cookie.parse(cookies || "");
  const value = allCookies[key];

  if (typeof value === "undefined") return defaultValue;

  if (typeof decode !== "undefined") return decode(value);

  return value;
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
      decode: options?.decode,
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
