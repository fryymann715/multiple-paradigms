import Token, { TOKEN_MAP } from './token'

export default class Lexer {
  constructor( fileContents ) {
    this.fileContents = fileContents
  }

  lex() {
    let tokens = []

    for( let index = 0; index < this.fileContents.length; index++ ) {
      tokens.push( new Token(
        TOKEN_MAP[ this.fileContents[ index ]],
        this.fileContents[ index ]
      ))
    }
    return tokens
  }
}
