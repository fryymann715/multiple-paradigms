import Lexer from './lexer'
import Line from './line'
import MultiLine from './MultiLine'
import * as tokenVars from './token'

export default class Parser {
  constructor ( fileContent ) {
    this.fileContent = fileContent
    this.tokens = []
    this.listLineStorage = []
    this.listType = null
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

  setListType = type => {
    if ( this.isValidListType( type ) ) {
      if ( this.listType === null ) {
        this.listType = type
      }
    }
  }

  isValidListType = ( type ) => {
    if ( type === tokenVars.NUMB ||
        type === tokenVars.ASTERISK ||
        type === tokenVars.HYPHEN ) {
      return true
    }
  }

  isListItem = type => {
    this.setListType( type )
    if ( this.beginningToken.type === tokenVars.NUMB &&
      this.currentToken.type === tokenVars.NEW_LINE &&
      this.afterBeginningToken.type === tokenVars.DOT ) {
      return true
    } else {
      return (
        ( this.beginningToken.type === tokenVars.ASTERISK ||
          this.beginningToken.type === tokenVars.HYPHEN ) &&
          this.currentToken.type === tokenVars.NEW_LINE &&
          this.afterBeginningToken.type === tokenVars.SPACE
        )
    }
  }

  addListToOutput = () => {
    this.addToOutput( this.createMultiLine() )
    this.listType = null
    this.listLineStorage = []
  }

  isListFinished = () =>
    this.nextToken.type !== tokenVars.ASTERISK &&
    this.nextToken.type !== tokenVars.HYPHEN &&
    this.nextToken.type !== tokenVars.NUMB

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
    this.beginningToken.type !== tokenVars.ASTERISK &&
    this.beginningToken.type !== tokenVars.HYPHEN &&
    this.beginningToken.type !== tokenVars.NUMB

  createLine = index =>
    new Line ({
      tokensArray: this.tokens.slice( this.lineStartIndex, index),
      type: this.beginningToken.type
    }).parse()

  createMultiLine = () =>
    new MultiLine ( this.listLineStorage, this.listType ).deliverHTML()

  addToOutput = line => this.outputHTML += line += '\n'

  startNewLine = index => {
    this.lineStartIndex = index + 1
    this.beginningToken = this.tokens [ this.lineStartIndex ]
  }

  parse() {
    this.getTokens()

    for ( let index = 0; index < this.tokens.length; index++ ) {
      this.setLocatorTokens( index )

      if ( this.isLineHeading() ) {
        this.addToOutput( this.createLine( index ) )
        this.startNewLine( index )
      } else if ( this.isBlankLine() ) {
        this.startNewLine( index )
      } else if ( this.lineEndsAtBlankLineOrHeader() ) {
        this.addToOutput( this.createLine( index ) )
        this.startNewLine( index )
      } else if ( this.isMultilineCodeBlock() ) {
        this.addToOutput( this.createLine( index ) )
        this.startNewLine( index )
      } else if ( this.isListItem( this.currentToken.type ) ) {
        this.listLineStorage.push( this.createLine( index ) )
        this.startNewLine( index )
          if ( this.isListFinished() ) {
            this.addListToOutput()
          }
      }
    }
    return this.outputHTML
  }
}
