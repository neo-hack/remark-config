import { remark } from 'remark'
import { reporter } from 'vfile-reporter'
import { test } from 'vitest'

import config from '../src/index'

async function main() {
  const file = await remark()
    .use(config)
    .process('1) Hello, _Jupiter_ and *Neptune*!')

  console.error(reporter(file as any))
}

test('basic', () => {
  main()
})
