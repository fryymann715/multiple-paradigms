import Lexer from './lexer'
import Line from './line'

export default class Parser {
  constructor ( fileContent ) {
    this.content = fileContent
    this.tokens = []
  }

  getTokens() {
    const lexer = new Lexer( this.content )
    this.tokens = lexer.lex()
    }

  parse() {
    this.getTokens()
    const tokens = this.tokens
    let output = '',
        lineStartIndex = 0

    for ( let index = 0; index < tokens.length; index++ ) {
      const currentToken = tokens[ index ]

      if ( currentToken.type === 'new_line' ) {
        output += new Line ( tokens.slice( lineStartIndex, index ) ).parse()
        output += '\n'
        lineStartIndex = index + 1
      }
    }

    return output
  }
}
