import fs from 'node:fs/promises'
import path from 'node:path'

import { remark } from 'remark'
import { reporter } from 'vfile-reporter'
import { expect, test } from 'vitest'

import config from '../src/index'

async function main() {
  const content = (await fs.readFile(path.resolve(__dirname, 'input.md'))).toString('utf-8')
  const file = await remark()
    .use(config)
    .process(content)

  console.error(reporter(file as any))
  fs.writeFile(path.resolve(__dirname, 'output.md'), file.toString())
  return {
    input: content,
    output: file.toString(),
  }
}

test('basic', async () => {
  const { input, output } = await main()
  expect(input).toMatchInlineSnapshot(output)
})
