# remark-config

[![npm](https://img.shields.io/npm/v/@aiou/remark-config)](https://github.com/neo-hack/remark-config) [![GitHub](https://img.shields.io/npm/l/@aiou/remark-config)](https://github.com/neo-hack/remark-config) [![stackblitz](https://img.shields.io/badge/%E2%9A%A1%EF%B8%8Fstackblitz-online-blue)](https://stackblitz.com/github/neo-hack/remark-config)

## usage

create `<root>/.remarkrc.mjs`

```js
import preset from '@aiou/remark-config'

const config = {
  plugins: [preset]
}

export default config
```

### `lint script`

> require `remark-cli`

add `lint:md` script in `package.json`

```json
{
  "scripts": {
    "lint:md": "remark ."
  }
}
```

## install

```console
pnpm i @aiou/remark-config
```

## development

*   **Setup** - `pnpm i`
*   **Build** - `pnpm build`

#

<div align='right'>

*built with ❤️ by 😼*

</div>
