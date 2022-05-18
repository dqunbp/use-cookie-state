import { act, renderHook } from "@testing-library/react-hooks";
import cookie from "cookie";
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

it("should use custom decodeOps", async () => {
  document.cookie = cookie.serialize("mykey", "initialCookieValue");

  const { result } = renderHook(() =>
    useCookieState("mykey", "myCookieValue", {
      decodeOps: { decode: () => "decoded" },
    })
  );

  expect(result.current[0]).toBe("decoded");
});

it("should use custom encodeOps 1", async () => {
  const { result } = renderHook(() =>
    useCookieState("mykey", "myCookieValue", {
      encodeOps: { encode: () => "encoded" },
    })
  );

  act(() => {
    result.current[1]("updated");
  });

  expect(result.current[0]).toBe("updated");

  const cookieValue = cookie.parse(document.cookie);

  expect(cookieValue["mykey"]).toBe("encoded");
});

it("should use custom encodeOps 2", async () => {
  const { result } = renderHook(() =>
    useCookieState("mykey", "myCookieValue", {
      encodeOps: { expires: new Date(0) },
    })
  );

  act(() => {
    result.current[1]("updated");
  });

  const cookieValue = cookie.parse(document.cookie);

  expect(cookieValue["mykey"]).toBe(undefined);
});

it("should accept custom encodeOps with `setCookieValue`", () => {
  const { result } = renderHook(() =>
    useCookieState("mykey", "myCookieValue", {
      encodeOps: { domain: "test.com" },
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
