import chai, { expect } from 'chai'

const fs = require('fs')

const paragraph = fs.readFileSync('src/paragraph.md', 'utf8')
import ooParser from '../lib-object-oriented/parser'

describe('paragraph', () => {

  context('object-oriented', () =>{
    const miraculousParser = new ooParser( paragraph )
    const parsedLines = miraculousParser.parse().split('\n')

    it('wraps single line in <p> tags', () => {
      expect(parsedLines[0]).to.equal('<p>What up world?</p>')
    })

    it('wraps multiple lines in <p> tags', () => {
      expect(parsedLines[1]).to.equal('<p>How be the world today?</p>')
    })

    it('wraps a line containing other markdown characters in <p> tags', () => {
      expect(parsedLines[2]).to.equal('<p>I is doing great, thanks for asking</p>')
    })

    it('creates a paragraph line after a non paragraph line', () => {
      expect(parsedLines[4]).to.equal('<p>Heck yes, you will</p>')
    })


  })

})
