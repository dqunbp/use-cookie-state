# use-cookie-state

Simple React persistent state management hook, based on browser cookies

[![NPM](https://img.shields.io/npm/v/use-cookie-state)](https://www.npmjs.com/package/use-cookie-state)



[![Codecov](https://img.shields.io/codecov/c/github/dqunbp/use-cookie-state)](https://codecov.io/gh/dqunbp/use-cookie-state)

[Dev.to article on writing this library](https://dev.to/dqunbp/store-state-in-cookies-with-use-cookie-value-react-hook-4i4f)

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

## 🕹 API

#### 🔗 useCookieState

##### Options

- **key** - used as cookie name
- **value** - initial value, any value or object or function with returns initial hook value
- **options** *(optional)*
  - **decode** *(optional)* - cookie parse [options](https://www.npmjs.com/package/cookie#options)
  - **encode** *(optional)* - cookie serialize [options](https://www.npmjs.com/package/cookie#options-1)

###### Default encode options

If no encode options are passed, the default encode options will be used.

`{ path: "/", expires: new Date("10000") }`

Otherwise, the passed encode options will be merged with the default encode options.

```ts
useCookieState(
  key: string;
  value: any; 
  options?: {
    decode?: cookie.CookieParseOptions, 
    encode?: cookie.CookieSerializeOptions // = { path: "/", expires: new Date("10000") }
  };
)
```

##### Returns

- **value** - current cookie value
- **setValue** - callback to update cookie value

```ts
[
  value: T,
  setValue(value: T, encode? cookie.CookieSerializeOptions)
]
```


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

  return <div>Current state: {state}</div>
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
    encode: {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }
  })

  const handleUpdate = () => {
    setState(
      "next cookie value", 
      { encode: { domain: "example.com"} } // update value fn also accepts custom encode options
    )
  }

  return (
    <div>
      <div>Current state: {state}</div>
      <button onClick={handleUpdate}>Update current state</button>
    </div>
  )
}

export default MyComponent
```

---

## License

MIT © [dqunbp](https://github.com/dqunbp)
