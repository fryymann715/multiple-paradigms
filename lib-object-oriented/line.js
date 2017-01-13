import Tag from './tag'
import * as tokenVars from './token'

export default class Line {
  constructor({ tokensArray, type }) {
    this.tokensArray = tokensArray
    this.tagType = type
    this.symbolCount = 0
    this.output = ''
  }

  isNotCodeBlock = () => {
    return this.tagType !== tokenVars.TICK ||
      ( this.tagType === tokenVars.TICK &&
      this.symbolCount === 1 )
  }

  shouldSkip = ( index, currentToken ) => {
    if (( this.tagType === tokenVars.HYPHEN ||
        this.tagType === tokenVars.ASTERISK ) &&
        index === 1 &&
        currentToken.type === tokenVars.SPACE ) {
      return true
    } else if ( this.tagType === tokenVars.NUMB &&
      index <= 2 ) {
        return true
      }

  }

  newLinesToSpaces = () => {
    if ( this.isNotCodeBlock() ) {
      while ( this.tokensArray.findIndex( this.findNewLine ) > -1 ) {
        const newLine = this.tokensArray.find( this.findNewLine )
        if ( newLine ) {
          newLine.type = tokenVars.SPACE
          newLine.value = tokenVars.SPACE
        }
      }
    }
  }

  createTag = variety =>
    new Tag({
      tagType: this.tagType,
      variety: variety,
      symbolCount: this.symbolCount
    }).deliverHTMLTag()

  findNewLine = element => element.type === tokenVars.NEW_LINE

  getSymbolCount = () => {
    this.symbolCount = 0
    for ( let index = 0; index < this.tokensArray.length; index++ ) {
      const currentToken = this.tokensArray[ index ]

      if ( currentToken.isMarkdown() ) {
        if ( currentToken
            .isPartOfMarkdownLabel( this.tagType, index, this.symbolCount )) {
          this.symbolCount++
        }
      }
    }
  }

  parse = () => {
    this.getSymbolCount()
    this.newLinesToSpaces()

    for ( let index = 0; index < this.tokensArray.length; index++ ) {
      const currentToken = this.tokensArray[ index ]

      if ( currentToken.isMarkdown() ) {
        if ( index === 0 ) {
          this.tagType = currentToken.type
        } else if ( currentToken.shouldNotBeRemoved( this.tagType ) ) {
          this.output += currentToken.value
        }
      } else {
        if ( this.shouldSkip( index, currentToken ) ) {
          continue
        }
        this.output += currentToken.value
      }
    }

    if ( this.tagType === tokenVars.CHAR ) {
      this.tagType = 'p'
    }

    this.output = this.createTag( 'opening' ) +
      this.output +
      this.createTag( 'closing' )

    return this.output
  }
}
