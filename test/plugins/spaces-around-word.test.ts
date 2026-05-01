import { remark } from 'remark'
import { reporter } from 'vfile-reporter'
import {
  describe,
  expect,
  test,
} from 'vitest'

import spacesAroundWord from '../../src/plugins/spaces-around-word'

describe('spaces-around-word plugin', () => {
  test('auto-fixes missing space between Chinese and English word', async () => {
    const input = '这是一份中文API文档。'

    const file = await remark()
      .use(spacesAroundWord)
      .process(input)

    const output = file.toString()
    const report = reporter(file as any)

    // Should auto-fix
    expect(output).toContain('中文 API 文档')
    expect(output).not.toContain('中文API')
    // Should report the issues
    expect(report).toContain('space between')
    expect(report).toContain('API')
  })

  test('keeps existing spaces without report', async () => {
    const input = '这是一份中文 API 文档。'

    const file = await remark()
      .use(spacesAroundWord)
      .process(input)

    const report = reporter(file as any)

    expect(file.toString()).toContain('中文 API 文档')
    // Should not report when spaces already exist
    expect(report).not.toContain('space between')
  })

  test('handles multiple English words', async () => {
    const input = '使用HTTP协议。'

    const file = await remark()
      .use(spacesAroundWord)
      .process(input)

    expect(file.toString()).toMatch(/使用\s+HTTP\s+协议/)
  })

  test('handles English word at start', async () => {
    const input = 'HTTP协议。'

    const file = await remark()
      .use(spacesAroundWord)
      .process(input)

    expect(file.toString()).toMatch(/HTTP\s+协议/)
  })
})
