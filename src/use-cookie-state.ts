import cookie from "cookie";
import { useState } from "react";

export type EncodeOps = cookie.CookieSerializeOptions;
export type DecodeOps = cookie.CookieParseOptions;

type Options = { decodeOps?: DecodeOps; encodeOps?: EncodeOps };

type GetCookieValue<T> = {
  key: string;
  cookies: string;
  options: DecodeOps | undefined;
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

const defaultEncodeOps: EncodeOps = { path: "/", expires: new Date("10000") };

export function useCookieState<T = string>(
  key: string,
  initialValue: T,
  options: Options = { encodeOps: defaultEncodeOps }
): [T, (value: T, encodeOps?: EncodeOps) => void] {
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

  const setNextValue = (value: T, encodeOps?: EncodeOps) => {
    const stringified =
      typeof value === "string" ? value : JSON.stringify(value);

    document.cookie = cookie.serialize(
      key,
      stringified,
      encodeOps ?? options?.encodeOps
    );

    setValue(value);
  };

  return [value, setNextValue];
}
