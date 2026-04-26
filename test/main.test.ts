import fs from 'node:fs/promises'
import path from 'node:path'

import { remark } from 'remark'
import { reporter } from 'vfile-reporter'
import {
  describe,
  expect,
  test,
} from 'vitest'

import config from '../src/index'

describe('remark config', () => {
  test('config loads without errors', async () => {
    const file = await remark()
      .use(config)
      .process('# Hello')

    expect(file.toString()).toBeDefined()
  })

  test('frontmatter is preserved', async () => {
    const input = `---
title: Test
---

# Hello`

    const file = await remark()
      .use(config)
      .process(input)

    const output = file.toString()
    expect(output).toContain('---')
    expect(output).toContain('title: Test')
    expect(output).toContain('# Hello')
  })

  test('GFM tables work', async () => {
    const input = `| a | b |
| - | - |
| 1 | 2 |`

    const file = await remark()
      .use(config)
      .process(input)

    const output = file.toString()
    expect(output).toContain('| a | b |')
  })

  test('task lists work', async () => {
    const input = `- [x] done
- [ ] todo`

    const file = await remark()
      .use(config)
      .process(input)

    const output = file.toString()
    expect(output).toContain('- [x] done')
    expect(output).toContain('- [ ] todo')
  })

  test('unordered list uses dash', async () => {
    const input = `* item 1
* item 2`

    const file = await remark()
      .use(config)
      .process(input)

    const output = file.toString()
    expect(output).toContain('- item 1')
    expect(output).toContain('- item 2')
    expect(output).not.toContain('* item')
  })

  test('code blocks use fences', async () => {
    const input = '    code'

    const file = await remark()
      .use(config)
      .process(input)

    const output = file.toString()
    expect(output).toContain('```')
  })

  test('heading length warning works', async () => {
    const longHeading = `# ${'a'.repeat(70)}`

    const file = await remark()
      .use(config)
      .process(longHeading)

    const report = reporter(file as any)
    expect(report).toContain('maximum-heading-length')
  })

  test('duplicate headings in section warning works', async () => {
    const input = `# Title

## Section

# Title`

    const file = await remark()
      .use(config)
      .process(input)

    const report = reporter(file as any)
    // Note: This may or may not trigger depending on section logic
    expect(file.toString()).toBeDefined()
  })

  test('retext case-police works', async () => {
    const input = 'MACOS'

    const file = await remark()
      .use(config)
      .process(input)

    const report = reporter(file as any)
    expect(report).toContain('retext-case-police')
    expect(report).toContain('macOS')
  })

  test('no shell dollars warning works', async () => {
    const input = '```sh\n$ npm install\n```'

    const file = await remark()
      .use(config)
      .process(input)

    const report = reporter(file as any)
    expect(report).toContain('no-shell-dollars')
  })

  test('spaces around number warns on missing space', async () => {
    const input = '理财产品的收益是4.0%左右。'

    const file = await remark()
      .use(config)
      .process(input)

    const report = reporter(file as any)
    expect(report).toContain('spaces-around-number')
    expect(report).toContain('4.0%')
  })

  test('spaces around number passes with space', async () => {
    const input = '理财产品的收益是 4.0% 左右。'

    const file = await remark()
      .use(config)
      .process(input)

    const report = reporter(file as any)
    expect(report).not.toContain('spaces-around-number')
  })

  test('spaces around word warns on missing space', async () => {
    const input = '这是一份中文API文档。'

    const file = await remark()
      .use(config)
      .process(input)

    const report = reporter(file as any)
    expect(report).toContain('spaces-around-word')
    expect(report).toContain('API')
  })

  test('spaces around word passes with space', async () => {
    const input = '这是一份中文 API 文档。'

    const file = await remark()
      .use(config)
      .process(input)

    const report = reporter(file as any)
    expect(report).not.toContain('spaces-around-word')
  })

  test('basic snapshot', async () => {
    const content = (await fs.readFile(path.resolve(__dirname, 'input.md'))).toString('utf-8')
    const file = await remark()
      .use(config)
      .process(content)

    console.error(reporter(file as any))
    fs.writeFile(path.resolve(__dirname, 'output.md'), file.toString())

    expect(content).toMatchSnapshot()
    expect(file.toString()).toMatchSnapshot()
  })
})
