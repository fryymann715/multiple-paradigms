import CodeBlock from './tags/code.js'
import Heading from './tags/heading'
import BlockQuote from './tags/blockQuote'
import Paragraph from './tags/p'
import UnorderedList from './tags/ul'
import ListItem from './tags/li'
import * as tokenVars from './token'

export default class Tag {
  constructor({ tagType, variety, symbolCount }) {
    this.tagType = tagType
    this.variety = variety
    this.symbolCount = symbolCount
  }

  getTag() {
    switch ( this.tagType ) {
      case tokenVars.OCTOTHORP:
        return new Heading ( this.symbolCount ).deliver()
      case tokenVars.ARROW:
        return new BlockQuote().deliver()
      case 'p':
        return new Paragraph().deliver()
      case tokenVars.TICK:
        return new CodeBlock( this.symbolCount ).deliver()
      case tokenVars.ASTERISK:
        return new ListItem().deliver()
      case tokenVars.HYPHEN:
        return new ListItem().deliver()
      default:
        console.error( 'Invalid tag type' )
    }
  }

  deliverHTMLTag() {
    return this.variety === 'opening'
      ? `<${this.getTag()}>`
      : `</${this.getTag()}>`
  }
}
