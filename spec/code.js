import chai, { expect } from 'chai'
import fs from 'fs'
import ooParser from '../lib-object-oriented/parser'

const codeBlock = fs.readFileSync('src/code.md', 'utf8')

describe('code', () => {

  context('object-oriented', () =>{
    const miraculousParser = new ooParser( codeBlock )
    const parsedLines = miraculousParser.parse().split('\n')

    it('wraps a line starting and ending with ` in a <code> tag', () => {
      expect( parsedLines[0] )
        .to.equal('<code>var i = b + 99</code>')
    })

    it('combines multiple lines into one code block if wrapped by `', () => {
      expect( parsedLines[1] )
        .to.equal('<code>var x = 0 var y = i + x</code>')
    })

    it('does not delete markdown characters', () => {
      expect( parsedLines[2] )
        .to.equal('<code>const mom = () => { ${console.log(\'cows\')} }</code>')
    })

    it('multiLine ``` block puts content on separate lines', () => {
      expect( parsedLines[3] ).to.equal('<pre>')
      expect( parsedLines[4] ).to.equal('console.log(\'go to sleep\')')
      expect( parsedLines[5] ).to.equal('process.exit()')
      expect( parsedLines[6] ).to.equal('</pre>')
    })

    it('code block beginning after another without space between has separate tag', () => {
      expect( parsedLines[7] )
        .to.equal('<code>hehe</code>')
    })

  })

})
