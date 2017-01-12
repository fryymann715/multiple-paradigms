import Tag from './tag'
import * as tokenVars from './token'

export default class Line {
  constructor({ tokensArray, type }) {
    this.tokensArray = tokensArray
    this.tagType = type
    this.symbolCount = 0
  }

  isNotCodeBlock = () => {
    return this.tagType !== tokenVars.TICK ||
      ( this.tagType === tokenVars.TICK &&
      this.symbolCount === 1 )
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

    let output = ''

    for ( let index = 0; index < this.tokensArray.length; index++ ) {
      const currentToken = this.tokensArray[ index ]

      if ( currentToken.isMarkdown() ) {
        if ( index === 0 ) { this.tagType = currentToken.type }

        if ( currentToken.isInsideCodeBlock( this.tagType ) ) {
          output += currentToken.value
        }
        if ( currentToken === tokenVars.TICK ) {
          continue
        }
      } else {
        output += currentToken.value
      }
    }

    if ( this.tagType === tokenVars.CHAR ) {
      this.tagType = 'p'
    }

    output = new Tag({
      tagType: this.tagType,
      variety: 'opening',
      symbolCount: this.symbolCount
    }).deliverHTMLTag() + output

    output += new Tag({
      tagType: this.tagType,
      variety: 'closing',
      symbolCount: this.symbolCount
    }).deliverHTMLTag()

    return output
  }
}
