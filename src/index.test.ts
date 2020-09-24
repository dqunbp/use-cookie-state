import { act, renderHook } from "@testing-library/react-hooks";
import cookie from "cookie";
import { useCookieState } from "./use-cookie-state";

it("should use initial value", () => {
  const { result } = renderHook(() => useCookieState("mykey", "myvalue"));

  expect(result.current[0]).toBe("myvalue");
});

it("should use initial value from cookie", () => {
  document.cookie = cookie.serialize("mykey", "myCookieValue");
  const { result } = renderHook(() => useCookieState("mykey", "myvalue"));

  expect(result.current[0]).toBe("myCookieValue");
});

it("should update value", async () => {
  document.cookie = cookie.serialize("mykey", "myCookieValue");
  const { result } = renderHook(() => useCookieState("mykey", "myvalue"));

  expect(result.current[0]).toBe("myCookieValue");

  act(() => {
    result.current[1]("updatedCookieValue");
  });

  expect(result.current[0]).toBe("updatedCookieValue");

  const cookieValue = cookie.parse(document.cookie);

  expect(cookieValue["mykey"]).toBe("updatedCookieValue");
});
