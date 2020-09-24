# use-cookie-state

Simple React persistent state management hook, based on browser cookies

![npm](https://img.shields.io/npm/v/use-cookie-state)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/dqunbp/use-cookie-state/Release)
![Codecov](https://img.shields.io/codecov/c/github/dqunbp/use-cookie-state)

## Features

- Persist your state with brpwser cookies
- Based on [cookie](https://www.npmjs.com/package/cookie) package
- Supports parse/serizlize options
- Supports Server Side Rendering - behaves like a `useState` if browser cookies is inaccessible


## 📦 Installation

  ##### with npm

    $ npm install --save use-cookie-state cookie

  ##### with yarn

    $ yarn add use-cookie-state cookie


## 📖 Example

```jsx
import React from "react";
import { useCookieState } from "use-cookie-state";

function MyComponent() {
  const [state, setState] = useCookieState("mykey", "foo-bar")
}

export default MyComponent
```

## 🕹 API

#### 🔗 useCookieState

- **key** - used as cookie name
- **value** - value to persist
- **options** *(optional)*
  - **decodeOps** *(optional)* - cookie parse [options](https://www.npmjs.com/package/cookie#options)
  - **encodeOps** *(optional)* - cookie serialize [options](https://www.npmjs.com/package/cookie#options-1)

```ts
useCookieState(
  key: string;
  value: any; 
  options?: {
    decodeOps?: cookie.CookieParseOptions, 
    encodeOps?: cookie.CookieSerializeOptions
  };
)
```

---

## License

MIT © [dqunbp](https://github.com/dqunbp)
