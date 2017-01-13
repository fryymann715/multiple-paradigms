import chai, { expect } from 'chai'
import fs from 'fs'
import ooParser from '../lib-object-oriented/parser'

const blockQuote = fs.readFileSync('src/blockQuote.md', 'utf8')

describe('blockQuote', () => {

  context('object-oriented', () =>{
    const miraculousParser = new ooParser( blockQuote )
    const parsedLines = miraculousParser.parse().split('\n')

    it('wraps a line beginning in > in a <blockquote> tag', () => {
      expect( parsedLines[0] )
        .to.equal('<blockquote>Life life as though your cheese will mold at any minute</blockquote>')
    })

    it('wraps 2 lines following a line beginnging with > in a <blockquote> tag', () => {
      expect( parsedLines[1] )
        .to.equal('<blockquote>Listen to your grandmother</blockquote>')
    })

    it('wraps 3 lines following a line beginnging with > in a <blockquote> tag', () => {
      expect( parsedLines[2] )
        .to.equal('<blockquote>this on three lines</blockquote>')
    })

    it('removes extra markdown characters from string', () => {
      expect( parsedLines[3] )
        .to.equal('<blockquote>lets put a  in here?</blockquote>')
    })

  })

})
