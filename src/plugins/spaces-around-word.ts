import { generated } from 'unist-util-generated'
import { visit } from 'unist-util-visit'

import type { Node } from 'unist'
import type { VFile } from 'vfile'

// Match Chinese followed by English word
const CHINESE_BEFORE_WORD = /([\u4E00-\u9FA5])([a-zA-Z]+)/g

// Match English word followed by Chinese
const WORD_BEFORE_CHINESE = /([a-zA-Z]+)([\u4E00-\u9FA5])/g

function spacesAroundWord(tree: Node, file: VFile) {
  visit(tree, 'text', (node: any) => {
    if (generated(node)) {
      return
    }
    if (typeof node.value !== 'string') {
      return
    }

    let value = node.value
    let fixed = false

    // Check and fix: Chinese followed by English word
    value = value.replace(CHINESE_BEFORE_WORD, (match, chinese, word) => {
      fixed = true
      file.message(
        `Should have space between "${chinese}" and "${word}"`,
        node,
      )
      return `${chinese} ${word}`
    })

    // Check and fix: English word followed by Chinese
    value = value.replace(WORD_BEFORE_CHINESE, (match, word, chinese) => {
      fixed = true
      file.message(
        `Should have space between "${word}" and "${chinese}"`,
        node,
      )
      return `${word} ${chinese}`
    })

    if (fixed) {
      node.value = value
    }
  })
}

export default function remarkSpacesAroundWord() {
  return spacesAroundWord
}
