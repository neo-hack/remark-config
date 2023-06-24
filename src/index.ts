import commentConfig from 'remark-comment-config'
import frontMatter from 'remark-frontmatter'
import gfm from 'remark-gfm'
import blockquoteIndent from 'remark-lint-blockquote-indentation'
import checkBoxStyle from 'remark-lint-checkbox-character-style'
import codeblock from 'remark-lint-code-block-style'
import hardBreakSpaces from 'remark-lint-hard-break-spaces'
import listItemIndent from 'remark-lint-list-item-indent'
import listItemSpacing from 'remark-lint-list-item-spacing'
import maxHeadingLength from 'remark-lint-maximum-heading-length'
import noDuplicateHeadingInSection from 'remark-lint-no-duplicate-headings-in-section'
import emptyUrl from 'remark-lint-no-empty-url'
import noHeadingIndent from 'remark-lint-no-heading-indent'
import noHeadingLikeP from 'remark-lint-no-heading-like-paragraph'
import noLiteralUrl from 'remark-lint-no-literal-urls'
import noMissingBlackListLines from 'remark-lint-no-missing-blank-lines'
import noMultipleTopLevelHeading from 'remark-lint-no-multiple-toplevel-headings'
import noShellDollars from 'remark-lint-no-shell-dollars'
import noTabs from 'remark-lint-no-tabs'
import orderListStyle from 'remark-lint-ordered-list-marker-style'
import ruleStyle from 'remark-lint-rule-style'
import spacesArrowNumber from 'remark-lint-spaces-around-number'
import spacesAroundWord from 'remark-lint-spaces-around-word'
import unOrderListStyle from 'remark-lint-unordered-list-marker-style'

import type { Preset } from 'unified'

const config: Required<Preset> = {
  // refs: https://github.com/remarkjs/remark-lint/tree/main#example-check-and-format-markdown-on-the-api
  // settings for format markdown
  settings: {
    bullet: '-',
    emphasis: '*',
    fences: true,
    rule: '-',
    ruleSpaces: false,
    listItemIndent: 'one',
    tightDefinitions: true,
  },
  // plugins for lint markdown
  plugins: [
    // recommended,
    commentConfig,
    hardBreakSpaces,
    emptyUrl,
    // refs: https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shell-dollars
    // Disable $ in front of ```sh```
    noShellDollars,
    noDuplicateHeadingInSection,
    // no h7
    noHeadingLikeP,
    noHeadingIndent,
    noMultipleTopLevelHeading,
    noLiteralUrl,
    noTabs,
    spacesArrowNumber,
    spacesAroundWord,
    [unOrderListStyle, '-'],
    [ruleStyle, '---'],
    [orderListStyle, '.'],
    [maxHeadingLength, 60],
    [codeblock, 'fenced'],
    [blockquoteIndent, 2],
    [listItemIndent, 'space'],
    [checkBoxStyle, { checked: 'x', unchecked: ' ' }],
    // No black lines between list item
    [noMissingBlackListLines, { exceptTightLists: true }],
    [listItemSpacing, { checkBlanks: true }],
    gfm,
    frontMatter,
  ],
}

export default config