import Tag from './tag'
import * as tokenVars from './token'

export default class Line {
  constructor({ tokensArray, type }) {
    this.tokensArray = tokensArray
    this.tagType = type
    this.symbolCount = 0
    this.output = ''
    this.currentToken = null
    this.nextToken = null
    this.previousToken = null
    this.endInlineStyle = false
  }

  isNotCodeBlock = () => {
    return this.tagType !== tokenVars.TICK ||
      ( this.tagType === tokenVars.TICK &&
      this.symbolCount === 1 )
  }

  isInList = index =>
    ( this.tagType === tokenVars.HYPHEN ||
      this.tagType === tokenVars.ASTERISK ) &&
    index === 1 &&
    this.currentToken.type === tokenVars.SPACE

  shouldSkip = index => {
    // console.log('ASKING IF SHOULD SKIP!')
    // console.log('index:', index)
    // console.log('this.currentToken.type:', this.currentToken.type)

    return this.isInList( index) ||
    (this.tagType === tokenVars.NUMB && index <= 2)
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

  getTagHTML = ( variety, type ) => {
    // if ( type === 'isBold' ) {
    //   this.tagType = 'bold'
    // }
    return new Tag({
      tagType: this.tagType,
      variety: variety,
      symbolCount: this.symbolCount
    }).deliverHTML()
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

  setLocatorTokens = index => {
    this.currentToken = this.tokensArray[ index ]
    this.nextToken = this.tokensArray[ index + 1 ] || { type: null }
    this.previousToken = this.tokensArray[ index - 1 ] || { type: null }

  }

  isNextBold = () =>
    ( this.currentToken.type === tokenVars.ASTERISK &&
      this.nextToken.type === tokenVars.ASTERISK ) ||
    ( this.currentToken.type === tokenVars.UNDERSCORE &&
      this.nextToken.type === tokenVars.UNDERSCORE )

  isPreviousBold = () =>
    ( this.currentToken.type === tokenVars.ASTERISK &&
      this.previousToken.type === tokenVars.ASTERISK ) ||
    ( this.currentToken.type === tokenVars.UNDERSCORE &&
      this.previousToken.type === tokenVars.UNDERSCORE )

  isBold = () => this.isNextBold() || this.isPreviousBold()

  isUnorderedList = () =>
    ( this.currentToken.type === tokenVars.ASTERISK ||
      this.currentToken.type === tokenVars.HYPHEN ) &&
    ( this.nextToken.type === tokenVars.SPACE )

  isOrderedList = () =>
    this.currentToken.type === tokenVars.NUMB &&
    this.nextToken.type === tokenVars.DOT

  setTagType = index => {
    if ( this.isOrderedList() && index === 0 ||
         this.isUnorderedList() && index === 0 ) {
      this.tagType = 'li'
    } else if ( this.isBold() && index === 0 ) {
      this.tagType = 'p'
    } else {
      if ( this.currentToken.type )
      this.tagType = this.currentToken.type
    }
  }

  handleBold = index => {
    if ( ( this.isBold() && this.tagType === 'p') ||
        ( this.isBold() && this.tagType === 'li') ) {
      if ( this.isPreviousBold() ) {
        if ( this.endInlineStyle === false ) {
          this.output += this.getTagHTML( 'opening', 'isBold' )
          this.setTagType( index )
          this.endInlineStyle = true
        } else if ( this.endInlineStyle === true ) {
          this.output += this.getTagHTML( 'closing', 'isBold' )
          this.setTagType( index )
          this.endInlineStyle = false
        }
      }
    }
  }

  parse = () => {
    this.getSymbolCount()
    this.newLinesToSpaces()

    for ( let index = 0; index < this.tokensArray.length; index++ ) {
      this.setLocatorTokens( index )

      if ( this.currentToken.isMarkdown() ) {
        if ( index === 0 ) {
          this.setTagType( index )
        } else if ( this.currentToken.shouldNotBeRemoved( this.tagType ) ) {
          this.output += this.currentToken.value
        }
        this.handleBold( index )
      } else {
        if ( this.shouldSkip( index ) ) {
          continue
        }
        this.output += this.currentToken.value
      }
    }

    if ( this.tagType === tokenVars.CHAR ) {
      this.tagType = 'p'
    }

    this.output = this.getTagHTML( 'opening' ) +
      this.output +
      this.getTagHTML( 'closing' )

    return this.output
  }
}
