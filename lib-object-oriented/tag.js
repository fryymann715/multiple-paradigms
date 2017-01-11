import Heading from './tags/heading'

export default class Tag {
  constructor({ tagType, variety, symbolCount }) {
    this.tagType = tagType
    this.variety = variety
    this.symbolCount = symbolCount
  }

  getTag() {
    if ( this.tagType === '#' ){
      return new Heading( this.symbolCount ).deliver() }
  }

  deliver() {
    return this.variety === 'opening'
      ? `<${this.getTag()}>`
      : `</${this.getTag()}>`
  }
}
