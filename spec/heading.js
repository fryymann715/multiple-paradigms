import chai, { expect } from 'chai'

const fs = require('fs')
const h1 = fs.readFileSync('src/heading.md', 'utf8')
import ooParser from '../lib-object-oriented/parser'

describe('heading', () => {

  context('object-oriented', () => {
    const miraculousParser = new ooParser( h1 )
    const parsedLines = miraculousParser.parse().split('\n')

    it('wraps a line beginning in # in an h1 tag', () => {
      expect( parsedLines[0] )
        .to.equal('<h1>fish is amazing</h1>')
    })

    it('wraps a line beginning in ## in an h2 tag', () => {
      expect( parsedLines[1] )
        .to.equal('<h2>more fish is better</h2>')
    })

    it('wraps a line beginning in ### in an h3 tag', () => {
      expect( parsedLines[2] )
        .to.equal('<h3>test for fish things</h3>')
    })

    it('wraps a line beginning in #### in an h4 tag', () => {
      expect( parsedLines[3] )
        .to.equal('<h4>do more typing</h4>')
    })

    it('wraps a line beginning in ##### in an h5 tag', () => {
      expect( parsedLines[4] )
        .to.equal('<h5>salmon is the shiznet</h5>')
    })

    it('wraps a line beginning in ###### in an h6 tag', () => {
      expect( parsedLines[6] )
        .to.equal('<h6>i love giraffes</h6>')
    })
  })

})
