import Tag from './tag'
import { ASTERISK, HYPHEN, NUMB } from './token'

export default class MultiLine {
  constructor( lineCollection, type ) {
    this.lineCollection = lineCollection
    this.listType = type
    this.htmlOutput = ''
    this.tagType = null
  }

  determineTagType = () => {
    if ( this.listType === ASTERISK || this.listType === HYPHEN ) {
      this.tagType = 'ul'
    } else if ( this.listType === NUMB ) {
      this.tagType = 'ol'
    }
  }

  createTag = variety =>
    new Tag({
      tagType: this.tagType,
      variety: variety
    }).deliverHTMLTag()

  deliverHTML = () => {
    this.determineTagType()
    this.htmlOutput = this.createTag( 'opening' ) + '\n'
    this.lineCollection.forEach( line => {
      this.htmlOutput += line + '\n'
    })
    this.htmlOutput += this.createTag( 'closing' )
    return this.htmlOutput
  }
}
