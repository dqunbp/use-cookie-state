# use-cookie-state

Simple React persistent state management hook, based on browser cookies

[![NPM](https://img.shields.io/npm/v/use-cookie-state)](https://www.npmjs.com/package/use-cookie-state)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/dqunbp/use-cookie-state/Release)](https://github.com/dqunbp/use-cookie-state/actions?query=workflow%3ARelease)
[![Codecov](https://img.shields.io/codecov/c/github/dqunbp/use-cookie-state)](https://codecov.io/gh/dqunbp/use-cookie-state)

## Features

- Persist your state with browser cookies
- Based on [cookie](https://www.npmjs.com/package/cookie) package
- Supports parse/serialize options
- Supports Server Side Rendering - behaves like a `useState` if browser cookies is inaccessible


## 📦 Installation

  ##### with npm

    $ npm install --save use-cookie-state cookie

  ##### with yarn

    $ yarn add use-cookie-state cookie


## 📖 Examples

`useCookieState` behaves like `React.useState` hook, just put the cookie key as the first argument and the value or function or object or anything else as the second arg.
The state will be persistent between rerenders and page reloads.
Don't worry about serializing or parsing the state value it just works our of the box!

### With simple object and default options

```jsx
import React from "react";
import { useCookieState } from "use-cookie-state";

function MyComponent() {
  const [state, setState] = useCookieState("mykey", { foo: "bar" })
}

export default MyComponent
```

### With custom options and function as initial arg

```jsx
import React from "react";
import { useCookieState } from "use-cookie-state";

const getCookiesInitialValue = () => {
  return "my initial value"
}

function MyComponent() {
  const [state, setState] = useCookieState("mykey", getCookiesInitialValue, {
    encodeOps: {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }
  })
}

export default MyComponent
```

## 🕹 API

#### 🔗 useCookieState

- **key** - used as cookie name
- **value** - initial value, any value or object or function with returns initial hook value
- **options** *(optional)*
  - **decodeOps** *(optional)* - cookie parse [options](https://www.npmjs.com/package/cookie#options)
  - **encodeOps** *(optional)* - cookie serialize [options](https://www.npmjs.com/package/cookie#options-1)

**Default encodeOps**: `{ path: "/", expires: new Date("10000") }`

```ts
useCookieState(
  key: string;
  value: any; 
  options?: {
    decodeOps?: cookie.CookieParseOptions, 
    encodeOps?: cookie.CookieSerializeOptions // { path: "/", expires: new Date("10000") } by default
  };
)
```

---

## License

MIT © [dqunbp](https://github.com/dqunbp)
