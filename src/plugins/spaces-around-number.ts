import { generated } from 'unist-util-generated'
import { visit } from 'unist-util-visit'

import type { Node } from 'unist'
import type { VFile } from 'vfile'

// Match Chinese followed by number (including decimals and percentages)
const CHINESE_BEFORE_NUMBER = /([\u4E00-\u9FA5])(\d+(?:\.\d+)?%?)/g

// Match number followed by Chinese
const NUMBER_BEFORE_CHINESE = /(\d+(?:\.\d+)?%?)([\u4E00-\u9FA5])/g

function spacesAroundNumber(tree: Node, file: VFile) {
  visit(tree, 'text', (node: any) => {
    if (generated(node)) {
      return
    }
    if (typeof node.value !== 'string') {
      return
    }

    let value = node.value
    let fixed = false

    // Check and fix: Chinese followed by number
    value = value.replace(CHINESE_BEFORE_NUMBER, (match, chinese, number) => {
      fixed = true
      file.message(
        `Should have space between "${chinese}" and "${number}"`,
        node,
      )
      return `${chinese} ${number}`
    })

    // Check and fix: number followed by Chinese
    value = value.replace(NUMBER_BEFORE_CHINESE, (match, number, chinese) => {
      fixed = true
      file.message(
        `Should have space between "${number}" and "${chinese}"`,
        node,
      )
      return `${number} ${chinese}`
    })

    if (fixed) {
      node.value = value
    }
  })
}

export default function remarkSpacesAroundNumber() {
  return spacesAroundNumber
}
