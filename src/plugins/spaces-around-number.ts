import { generated } from 'unist-util-generated'
import { visit } from 'unist-util-visit'

import type { Node } from 'unist'

// Match Chinese followed by number (including decimals and percentages)
const CHINESE_BEFORE_NUMBER = /([\u4E00-\u9FA5])(\d+(?:\.\d+)?%?)/g

// Match number followed by Chinese
const NUMBER_BEFORE_CHINESE = /(\d+(?:\.\d+)?%?)([\u4E00-\u9FA5])/g

function fixSpacesAroundNumber(tree: Node) {
  visit(tree, 'text', (node: any) => {
    if (generated(node)) {
      return
    }
    if (typeof node.value !== 'string') {
      return
    }

    let value = node.value

    // First pass: add space between Chinese and number
    value = value.replace(CHINESE_BEFORE_NUMBER, '$1 $2')

    // Second pass: add space between number and Chinese
    value = value.replace(NUMBER_BEFORE_CHINESE, '$1 $2')

    if (value !== node.value) {
      node.value = value
    }
  })
}

export default function remarkSpacesAroundNumber() {
  return fixSpacesAroundNumber
}
