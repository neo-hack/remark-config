import casePolice from '@julian_cataldo/retext-case-police'
import contractions from 'retext-contractions'
import indefiniteArticle from 'retext-indefinite-article'
import quotes from 'retext-quotes'
import repeatedWords from 'retext-repeated-words'
import sentenceSpacing from 'retext-sentence-spacing'

import type { Preset } from 'unified'

const config: Preset = {
  plugins: [
    casePolice,
    [sentenceSpacing, { preferred: 2 }],
    repeatedWords,
    indefiniteArticle,
    [quotes, { smart: ['‘’', '“”', '""'] }],
    contractions,
  ],
}

export default config
