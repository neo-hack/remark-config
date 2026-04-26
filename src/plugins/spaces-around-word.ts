import { generated } from 'unist-util-generated'
import { visit } from 'unist-util-visit'

import type { Node } from 'unist'

// Match Chinese followed by English word
const CHINESE_BEFORE_WORD = /([\u4E00-\u9FA5])([a-zA-Z]+)/g

// Match English word followed by Chinese
const WORD_BEFORE_CHINESE = /([a-zA-Z]+)([\u4E00-\u9FA5])/g

function fixSpacesAroundWord(tree: Node) {
  visit(tree, 'text', (node: any) => {
    if (generated(node)) {
      return
    }
    if (typeof node.value !== 'string') {
      return
    }

    let value = node.value

    // First pass: add space between Chinese and English word
    value = value.replace(CHINESE_BEFORE_WORD, '$1 $2')

    // Second pass: add space between English word and Chinese
    value = value.replace(WORD_BEFORE_CHINESE, '$1 $2')

    if (value !== node.value) {
      node.value = value
    }
  })
}

export default function remarkSpacesAroundWord() {
  return fixSpacesAroundWord
}
