import chai, { expect } from 'chai'
import fs from 'fs'
import ooParser from '../lib-object-oriented/parser'

const list = fs.readFileSync('src/list.md', 'utf8')

describe('list', () => {

  context('object-oriented', () =>{
    const miraculousParser = new ooParser( list )
    const parsedLines = miraculousParser.parse().split('\n')

    it('wraps multiple lines beginning with - or * in an ul tag', () => {
      expect(parsedLines[0]).to.equal('<ul>')
      expect(parsedLines[3]).to.equal('</ul>')
    })

    it('wraps lines starting with - or * in li tags', () => {
      expect(parsedLines[1]).to.equal('<li>dance</li>')
      expect(parsedLines[2]).to.equal('<li>dance</li>')
    })

    it('starts a new list after a blank line', () => {
      expect(parsedLines[4]).to.equal('<ul>')
    })

    it('does not remove - and * from list line', () => {
      expect(parsedLines[5]).to.equal('<li>list**</li>')
    })

    it('wraps multiple lines beginning with numbers with ol tag', () => {
      expect(parsedLines[7]).to.equal('<ol>')
      expect(parsedLines[11]).to.equal('</ol>')
    })

    it('Original numbers are ommited from ol', () => {
      expect(parsedLines[8]).to.equal('<li>nonsense</li>')
      expect(parsedLines[9]).to.equal('<li>makes me</li>')
    })

    it('List after paragraph works', () => {
      expect(parsedLines[13]).to.equal('<ul>')
    })

  })

})
