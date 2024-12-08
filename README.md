# use-cookie-state

A simple, yet flexible React hook for managing persistent state through browser cookies.  
By leveraging browser cookies, `use-cookie-state` ensures that your component states remain consistent and available even after a page reload. It gracefully handles both client and server-side rendering (SSR) scenarios.

**Key Highlights**:
- **Persistent state**: Store your React state in browser cookies.
- **Similar to `useState`**: Familiar API and usage, making it intuitive for React developers.
- **Flexible options**: Customizable cookie settings, including `maxAge`, `expires`, `domain`, `path`, `secure`, `httpOnly`, `sameSite`, `priority`, and `partitioned`.
- **SSR-friendly**: Falls back to `useState` behavior when `document.cookie` is not accessible.

[![NPM](https://img.shields.io/npm/v/use-cookie-state)](https://www.npmjs.com/package/use-cookie-state)
[![Codecov](https://img.shields.io/codecov/c/github/dqunbp/use-cookie-state)](https://codecov.io/gh/dqunbp/use-cookie-state)

## Table of Contents

- [use-cookie-state](#use-cookie-state)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [API Reference](#api-reference)
  - [Cookie Options](#cookie-options)
    - [Default Encode Options:](#default-encode-options)
    - [Other Encode Options:](#other-encode-options)
  - [Examples](#examples)
    - [Basic Usage](#basic-usage)
    - [Handling Complex Data (JSON)](#handling-complex-data-json)
    - [Custom Cookie Settings](#custom-cookie-settings)
    - [Runtime Overrides](#runtime-overrides)
  - [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
  - [Tips \& Best Practices](#tips--best-practices)
  - [License](#license)

---

## Installation

**Using npm:**
```bash
npm install --save use-cookie-state cookie
```

**Using yarn:**
```bash
yarn add use-cookie-state cookie
```

> **Note:** The `cookie` package is a peer dependency and must be installed alongside `use-cookie-state`.

---

## API Reference

```ts
useCookieState<T = string>(
  key: string,
  initialValue: T,
  options?: {
    decode?: (value: string) => any; 
    encode?: CookieSerializeOptions;
  }
): [T, (value: T, encode?: CookieSerializeOptions) => void];
```

**Parameters:**
- **key** (*string*, required): Cookie name.
- **initialValue** (*T*, required): Initial state value. Can be a primitive, object, or a function returning the initial value.
- **options** (optional):
  - **decode**: A function to decode the cookie value when reading it from `document.cookie`.
  - **encode**: An object specifying default cookie attributes used when writing the cookie.

**!IMPORTANT!**: Due the `cookie` package implementation, the `decode` function will be applied for each cookie value, during the cookies parsing process. Be patient to use try/catch block to avoid errors.

**Return Value:**
- An array `[value, setValue]` similar to `useState`:
  - **value**: The current state derived from the cookie.
  - **setValue(value: T, encode?: CookieSerializeOptions)**: Updates the cookie (and the state). Accepts optional runtime `encode` options to override defaults.

---

## Cookie Options

When setting or updating cookies, you can specify cookie-related attributes as `encode` options. These options influence how the cookie is stored and retrieved by the browser. All cookie attributes are optional.

### Default Encode Options:
If no `encode` options are provided, `use-cookie-state` defaults to:
```js
{ path: "/", expires: new Date("9999") }
```
> You can override these defaults by specifying your own `encode` options.

### Other Encode Options:

- **maxAge** (number): Maximum age of the cookie in seconds. If both `expires` and `maxAge` are set, `maxAge` takes precedence.
- **expires** (Date): Specific date and time when the cookie should expire.
- **domain** (string): The domain for which the cookie is valid. Defaults to the current domain if not set.
- **path** (string): The path for which the cookie is valid. Defaults to `"/"`.
- **httpOnly** (boolean): If `true`, the cookie is not accessible to client-side JavaScript.
- **secure** (boolean): If `true`, the cookie is only sent over HTTPS connections.
- **sameSite** (`true | "strict" | "lax" | "none"`): Controls cross-site request behavior.
  - `true` or `"strict"`: Strict same-site enforcement.
  - `"lax"`: Lax same-site enforcement.
  - `"none"`: No same-site restrictions.
- **priority** (`"low" | "medium" | "high"`): Sets the cookie’s priority.
- **partitioned** (boolean): Enables the `Partitioned` attribute for the cookie (experimental).

> You can find more details about these options in the cookie package documentation: [CookieSerializeOptions](https://www.npmjs.com/package/cookie#options-1).

---

## Examples

### Basic Usage

```jsx
import React from "react";
import { useCookieState } from "use-cookie-state";

function MyComponent() {
  const [value, setValue] = useCookieState("username", "JohnDoe");

  return (
    <div>
      <div>Username: {value}</div>
      <button onClick={() => setValue("JaneDoe")}>Change Username</button>
    </div>
  );
}

export default MyComponent;
```

### Handling Complex Data (JSON)

For objects/arrays, store as JSON and provide a `decode` function:

```jsx
import React from "react";
import { useCookieState } from "use-cookie-state";

function jsonDecode(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function MyComponent() {
  const [data, setData] = useCookieState("myData", { foo: "bar" }, { decode: jsonDecode });

  const updateData = () => {
    setData({ foo: "baz", count: 1 });
  };

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={updateData}>Update Data</button>
    </div>
  );
}

export default MyComponent;
```

**!IMPORTANT!**: Due the `cookie` package implementation, the `decode` function will be applied for each cookie value, during the cookies parsing process. Be patient to use try/catch block to avoid errors.

### Custom Cookie Settings

```jsx
import React from "react";
import { useCookieState } from "use-cookie-state";

function MyComponent() {
  const [value] = useCookieState("myKey", "initialVal", {
    encode: {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: true,
      sameSite: "strict",
      httpOnly: true
    }
  });

  return <div>Value: {value}</div>;
}

export default MyComponent;
```

### Runtime Overrides

```jsx
import React from "react";
import { useCookieState } from "use-cookie-state";

function MyComponent() {
  const [state, setState] = useCookieState("userToken", "abc123", {
    encode: { secure: true, path: "/" }
  });

  const updateToken = () => {
    // Add domain at runtime, merging it with the default secure and path options
    setState("newTokenValue", { domain: "example.com" });
  };

  return (
    <div>
      <div>Current Token: {state}</div>
      <button onClick={updateToken}>Update Token</button>
    </div>
  );
}

export default MyComponent;
```

---

## Server-Side Rendering (SSR)

On the server, `document.cookie` is not available. During SSR:
- `useCookieState` uses the provided `initialValue` directly, just like `useState`.
- No cookie operations occur until the browser environment is available.
  
Once hydrated, it will sync the component state with any browser cookies.

---

## Tips & Best Practices

1. **Keep cookie size small**: Most cookies have size limits (~4KB).
2. **Use JSON for complex data**: Consider `JSON.stringify` on write and a custom `decode` function on read.
3. **Security considerations**: Use `secure: true` if your site uses HTTPS.
4. **Domain and path**: Control where cookies are valid with `domain` and `path`.
5. **SameSite attribute**: Consider `sameSite` to protect against CSRF attacks or to allow cross-site requests depending on your needs.

---

## License

MIT © [dqunbp](https://github.com/dqunbp)
