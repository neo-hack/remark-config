import { lintRule } from 'unified-lint-rule'
import { generated } from 'unist-util-generated'
import { visit } from 'unist-util-visit'

import type { Node } from 'unist'
import type { VFile } from 'vfile'

const TEXT = 0
const SPACE = 1
const ENGLISH = 2
const CHINESE = 3

function getType(value: string): number {
  if (/[\u4E00-\u9FA5]/.test(value)) {
    return CHINESE
  }
  if (/[a-zA-Z]/.test(value)) {
    return ENGLISH
  }
  if (/\s/.test(value)) {
    return SPACE
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
  word: { text: string; start: CharNode; end: CharNode } | null

  constructor(file: VFile) {
    this.file = file
    this.type = TEXT
    this.error = {}
    this.word = null
  }

  report() {
    if (this.word) {
      if (this.error.start && this.error.end) {
        this.file.message(
          `Should have spaces around "${this.word.text}"`,
          {
            line: this.word.start.line,
            column: this.word.start.column,
            offset: this.word.start.offset,
          },
        )
      } else if (this.error.start && !this.error.end) {
        this.file.message(
          `Should have space before "${this.word.text}"`,
          {
            line: this.word.start.line,
            column: this.word.start.column,
            offset: this.word.start.offset,
          },
        )
      } else if (this.error.end && !this.error.start) {
        this.file.message(
          `Should have space after "${this.word.text}"`,
          {
            line: this.word.start.line,
            column: this.word.start.column,
            offset: this.word.start.offset,
          },
        )
      }
    }
    this.error = {}
  }

  appendWord(node: CharNode) {
    if (!this.word) {
      this.word = {
        text: '',
        start: node,
        end: node,
      }
    }
    this.word.end = node
    this.word.text += node.value
  }

  setError(prev: number, curr: number) {
    if (curr === ENGLISH && prev === CHINESE) {
      this.error.start = true
    } else if (curr === CHINESE && prev === ENGLISH) {
      this.error.end = true
    }
  }

  digestWord() {
    this.report()
    this.word = null
  }

  process(node: CharNode) {
    const prevType = this.type
    this.type = getType(node.value)

    this.setError(prevType, this.type)
    if (this.type === ENGLISH) {
      this.appendWord(node)
    } else {
      this.digestWord()
    }
  }

  end() {
    this.digestWord()
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

const remarkLintSpacesAroundWord = lintRule(
  {
    origin: 'remark-lint:spaces-around-word',
    url: 'https://github.com/JiangWeixian/remark-config',
  },
  processor,
)

export default remarkLintSpacesAroundWord
