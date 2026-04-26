import { remark } from 'remark'
import { reporter } from 'vfile-reporter'
import {
  describe,
  expect,
  test,
} from 'vitest'

import spacesAroundNumber from '../../src/plugins/spaces-around-number'

describe('spaces-around-number plugin', () => {
  test('auto-fixes missing space between Chinese and number', async () => {
    const input = '理财产品的收益是4.0%左右。'

    const file = await remark()
      .use(spacesAroundNumber)
      .process(input)

    const output = file.toString()
    const report = reporter(file as any)

    // Should auto-fix
    expect(output).toMatch(/理财产品的收益是\s+4\.0%\s+左右/)
    // Should report the issues
    expect(report).toContain('space between')
    expect(report).toContain('4.0%')
  })

  test('keeps existing spaces without report', async () => {
    const input = '理财产品的收益是 4.0% 左右。'

    const file = await remark()
      .use(spacesAroundNumber)
      .process(input)

    const report = reporter(file as any)

    expect(file.toString()).toContain(' 4.0% ')
    // Should not report when spaces already exist
    expect(report).not.toContain('space between')
  })

  test('handles decimal numbers', async () => {
    const input = '价格是3.14元。'

    const file = await remark()
      .use(spacesAroundNumber)
      .process(input)

    expect(file.toString()).toMatch(/价格是\s+3\.14\s+元/)
  })

  test('handles percentage', async () => {
    const input = '增长了50%以上。'

    const file = await remark()
      .use(spacesAroundNumber)
      .process(input)

    expect(file.toString()).toMatch(/增长了\s+50%\s+以上/)
  })
})
