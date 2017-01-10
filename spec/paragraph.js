import chai, { expect } from 'chai'

const fs = require('fs')
const singleLine = fs.readFileSync('src/paragraph/singleLine.md', 'utf8')
import ooParser from '../lib-object-oriented'

describe('paragraph', () => {

  context('object-oriented', () =>{
    const miraculousParser = new ooParser( singleLine )

    it('wraps single line in <p> tag', () => {
      expect(miraculousParser.outputMarkdown())
        .to.equal('<p>Crying is beautiful.</p>')
    })
  })

})
