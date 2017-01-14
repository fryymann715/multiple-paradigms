import chai, { expect } from 'chai'
import fs from 'fs'
import ooParser from '../lib-object-oriented/parser'

const bold = fs.readFileSync('src/bold.md', 'utf8')

describe('bold', () => {

  context('object-oriented', () =>{
    const miraculousParser = new ooParser( bold )
    const parsedLines = miraculousParser.parse().split('\n')

  })

})
