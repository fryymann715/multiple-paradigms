import Lexer from './lexer'
import Line from './line'
import * as tokenVars from './token'

export default class Parser {
  constructor ( fileContent ) {
    this.fileContent = fileContent
    this.tokens = []
    this.listLineStorage = []
    this.lineStartIndex = 0
    this.beginningToken = null
    this.currentToken = null
    this.previousToken = null
    this.nextToken = null
    this.afterBeginningToken = null
    this.outputHTML = ''
  }

  getTokens() {
    const lexer = new Lexer( this.fileContent )
    this.tokens = lexer.lex()
    this.beginningToken = this.tokens[ this.lineStartIndex ]
  }

  setLocatorTokens = index => {
    this.currentToken = this.tokens[ index ],
    this.previousToken = this.tokens[ index - 1 ],
    this.nextToken = this.tokens[ index + 1 ] || { type: null },
    this.afterBeginningToken = this.tokens[ this.lineStartIndex + 1 ]
  }

  isLineHeading = () => this.beginningToken.type === tokenVars.OCTOTHORP &&
    this.currentToken.type === tokenVars.NEW_LINE

  isBlankLine = () => this.beginningToken.type === tokenVars.NEW_LINE

  isListItem = () =>
    ( this.beginningToken.type === ( tokenVars.ASTERISK ) ||
      this.beginningToken.type === ( tokenVars.HYPHEN )) &&
    this.currentToken.type === tokenVars.NEW_LINE &&
    this.afterBeginningToken.type === tokenVars.SPACE

  isMultilineCodeBlock = () =>
    this.currentToken.type === tokenVars.NEW_LINE &&
    this.beginningToken.type === this.nextToken.type &&
    this.beginningToken.type === this.previousToken.type &&
    this.beginningToken.type !== tokenVars.CHAR

  lineEndsAtBlankLineOrHeader = () =>
    this.currentToken.type === tokenVars.NEW_LINE &&
    ( this.nextToken.type === tokenVars.NEW_LINE ||
      this.nextToken.type === null ||
      this.nextToken.type === tokenVars.OCTOTHORP ) &&
    this.beginningToken.type !== ( tokenVars.ASTERISK ) &&
    this.beginningToken.type !== ( tokenVars.HYPHEN )

  createLine = index =>
    new Line ({
      tokensArray: this.tokens.slice( this.lineStartIndex, index),
      type: this.beginningToken.type
    }).parse()

  addLineToOutput = line => this.outputHTML += line += '\n'

  startNewLine = index => {
    this.lineStartIndex = index + 1
    this.beginningToken = this.tokens [ this.lineStartIndex ]
  }

  parse() {
    this.getTokens()

    for ( let index = 0; index < this.tokens.length; index++ ) {
      this.setLocatorTokens( index )

      if ( this.isLineHeading() ) {
        this.addLineToOutput( this.createLine( index ) )
        this.startNewLine( index )
      } else if ( this.isBlankLine() ) {
        this.startNewLine( index )
      } else if ( this.lineEndsAtBlankLineOrHeader() ) {
        this.addLineToOutput( this.createLine( index ) )
        this.startNewLine( index )
      } else if ( this.isMultilineCodeBlock() ) {
        this.addLineToOutput( this.createLine( index ) )
        this.startNewLine( index )
      } else if ( this.isListItem() ) {
        this.listLineStorage.push( this.createLine( index ) )
        this.startNewLine( index )
      }
    }
    return this.outputHTML
  }
}
