import { lintRule } from 'unified-lint-rule'
import { generated } from 'unist-util-generated'
import { visit } from 'unist-util-visit'

import type { Node } from 'unist'
import type { VFile } from 'vfile'

const TEXT = 0
const NUMBER = 1
const SPACE = 2
const CHINESE = 3

function getType(prev: string | undefined, curr: string): number {
  if (/[\u4E00-\u9FA5]/.test(curr)) {
    return CHINESE
  }
  if (/\s/.test(curr)) {
    return SPACE
  }
  if (/\d/.test(curr)) {
    return NUMBER
  }
  if ((curr === '%' || curr === '.') && prev && /\d/.test(prev)) {
    return NUMBER
  }
  return TEXT
}

interface CharNode {
  value: string
  line: number
  column: number
  offset: number
}

class Traveler {
  file: VFile
  type: number
  error: { start?: boolean; end?: boolean }
  number: { text: string; start: CharNode; end: CharNode } | null
  prevText: string | undefined

  constructor(file: VFile) {
    this.file = file
    this.type = TEXT
    this.error = {}
    this.number = null
  }

  report() {
    if (this.number) {
      if (this.error.start && this.error.end) {
        this.file.message(
          `Should have spaces around "${this.number.text}"`,
          {
            line: this.number.start.line,
            column: this.number.start.column,
            offset: this.number.start.offset,
          },
        )
      } else if (this.error.start && !this.error.end) {
        this.file.message(
          `Should have space before "${this.number.text}"`,
          {
            line: this.number.start.line,
            column: this.number.start.column,
            offset: this.number.start.offset,
          },
        )
      } else if (this.error.end && !this.error.start) {
        this.file.message(
          `Should have space after "${this.number.text}"`,
          {
            line: this.number.start.line,
            column: this.number.start.column,
            offset: this.number.start.offset,
          },
        )
      }
    }
    this.error = {}
  }

  appendNumber(node: CharNode) {
    if (!this.number) {
      this.number = {
        text: '',
        start: node,
        end: node,
      }
    }
    this.number.end = node
    this.number.text += node.value
  }

  setError(prev: number, curr: number) {
    if (curr === NUMBER && prev === CHINESE) {
      this.error.start = true
    } else if (prev === NUMBER && curr === CHINESE) {
      this.error.end = true
    }
  }

  digestNumber() {
    this.report()
    this.number = null
  }

  process(node: CharNode) {
    const prevType = this.type
    this.type = getType(this.prevText, node.value)

    this.setError(prevType, this.type)
    if (this.type === NUMBER) {
      this.appendNumber(node)
    } else if (prevType === NUMBER) {
      this.digestNumber()
    }

    this.prevText = node.value
  }

  end() {
    this.digestNumber()
  }
}

function toCharList(node: Node): CharNode[] {
  const list: CharNode[] = []
  const value = (node as any).value
  if (typeof value !== 'string') {
    return list
  }

  const start = node.position?.start
  if (!start) {
    return list
  }

  let line = start.line
  let column = start.column
  const offset = start.offset || 0

  for (let i = 0; i < value.length; i++) {
    const char = value[i]
    list.push({
      value: char,
      line,
      column,
      offset: offset + i,
    })
    if (char === '\n') {
      column = 1
      line += 1
    } else {
      column += 1
    }
  }

  return list
}

function collectChars(node: Node): CharNode[] {
  const chars: CharNode[] = []
  visit(node, 'text', (child) => {
    if (generated(child)) {
      return
    }
    chars.push(...toCharList(child))
  })
  return chars
}

function processor(tree: Node, file: VFile) {
  visit(tree, ['paragraph', 'heading'], (node) => {
    if (generated(node)) {
      return
    }
    const chars = collectChars(node)
    if (chars.length === 0) {
      return
    }
    const traveler = new Traveler(file)
    chars.forEach((char) => {
      traveler.process(char)
    })
    traveler.end()
  })
}

const remarkLintSpacesAroundNumber = lintRule(
  {
    origin: 'remark-lint:spaces-around-number',
    url: 'https://github.com/JiangWeixian/remark-config',
  },
  processor,
)

export default remarkLintSpacesAroundNumber
