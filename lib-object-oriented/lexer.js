import Token, { TOKEN_MAP } from './token'

export default class Lexer {
  constructor( fileContents ) {
    this.fileContents = fileContents
    this.tokens = []
  }

  lex() {
    if ( this.tokens.length === 0 ){

      for( let index = 0; index < this.fileContents.length; index++ ) {
        this.tokens.push( new Token( this.fileContents[ index ] ))
      }
      return this.tokens
    }
  }
}
