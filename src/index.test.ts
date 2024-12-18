import { act, renderHook } from "@testing-library/react";

import * as cookie from "cookie";
import { useCookieState } from "./use-cookie-state";

beforeEach(() => {
  for (const key in cookie.parse(document.cookie))
    document.cookie = cookie.serialize(key, "", { expires: new Date(0) });
});

it("should use initial value", () => {
  const { result } = renderHook(() => useCookieState("mykey", "myvalue"));

  expect(result.current[0]).toBe("myvalue");
});

it("should get initial value from function", () => {
  const { result } = renderHook(() => useCookieState("mykey", () => "myvalue"));

  expect(result.current[0]).toBe("myvalue");
});

it("should use initial value from cookie", () => {
  document.cookie = cookie.serialize("mykey", "myCookieValue");
  const { result } = renderHook(() => useCookieState("mykey", "myvalue"));

  expect(result.current[0]).toBe("myCookieValue");
});

it("should update value", async () => {
  const { result } = renderHook(() => useCookieState("mykey", "myCookieValue"));

  expect(result.current[0]).toBe("myCookieValue");

  act(() => {
    result.current[1]("updatedCookieValue");
  });

  expect(result.current[0]).toBe("updatedCookieValue");

  const cookieValue = cookie.parse(document.cookie);

  expect(cookieValue["mykey"]).toBe("updatedCookieValue");
});

it("should use custom decode", async () => {
  document.cookie = cookie.serialize("mykey", "initialCookieValue");

  const { result } = renderHook(() =>
    useCookieState("mykey", "myCookieValue", {
      decode: () => "decoded",
    })
  );

  expect(result.current[0]).toBe("decoded");
});

it("should use custom encode 1", async () => {
  const { result } = renderHook(() =>
    useCookieState("mykey", "myCookieValue", {
      encode: { encode: () => "encoded" },
    })
  );

  act(() => {
    result.current[1]("updated");
  });

  expect(result.current[0]).toBe("updated");

  const cookieValue = cookie.parse(document.cookie);

  expect(cookieValue["mykey"]).toBe("encoded");
});

it("should use custom encode 2", async () => {
  const { result } = renderHook(() =>
    useCookieState("mykey", "myCookieValue", {
      encode: { expires: new Date(0) },
    })
  );

  act(() => {
    result.current[1]("updated");
  });

  const cookieValue = cookie.parse(document.cookie);

  expect(cookieValue["mykey"]).toBe(undefined);
});

it("should accept custom encode with `setCookieValue`", () => {
  const { result } = renderHook(() =>
    useCookieState("mykey", "myCookieValue", {
      encode: { domain: "test.com" },
    })
  );

  let cookieValue = cookie.parse(document.cookie);
  expect(cookieValue["mykey"]).toBe(undefined);

  act(() => {
    result.current[1]("updatedCookieValue");
  });

  cookieValue = cookie.parse(document.cookie);
  expect(cookieValue["mykey"]).toBe(undefined);

  act(() => {
    result.current[1]("updatedCookieValue", { domain: "localhost" });
  });

  cookieValue = cookie.parse(document.cookie);

  expect(cookieValue["mykey"]).toBe("updatedCookieValue");
});
