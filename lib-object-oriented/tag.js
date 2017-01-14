import CodeBlock from './tags/code.js'
import Heading from './tags/heading'
import BlockQuote from './tags/blockQuote'
import Paragraph from './tags/p'
import UnorderedList from './tags/ul'
import OrderedList from './tags/ol'
import ListItem from './tags/li'
import Bold from './tags/bold'
import * as tokenVars from './token'

export default class Tag {
  constructor({ tagType, variety, symbolCount }) {
    this.tagType = tagType
    this.variety = variety
    this.symbolCount = symbolCount
  }

  getTag = () => {
    switch ( this.tagType ) {
      case tokenVars.OCTOTHORP:
        return new Heading ( this.symbolCount ).deliver()
      case tokenVars.ARROW:
        return new BlockQuote().deliver()
      case tokenVars.TICK:
        return new CodeBlock( this.symbolCount ).deliver()
      case 'li':
        return new ListItem().deliver()
      case tokenVars.NUMB:
        return new ListItem().deliver()
      case 'p':
        return new Paragraph().deliver()
      case 'ul':
        return new UnorderedList().deliver()
      case 'ol':
        return new OrderedList().deliver()
      case 'bold':
        return new Bold().deliver()
      default:
        console.error( 'Invalid tag type' )
    }
  }

  deliverHTML = () =>
    this.variety === 'opening'
      ? `<${this.getTag()}>`
      : `</${this.getTag()}>`
}
