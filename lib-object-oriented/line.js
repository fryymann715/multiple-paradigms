import Tag from './tag'

export default class Line {
  constructor( content ) {
    this.content = content
  }

  parse() {
    let output = '',
        symbolCount = 0,
        tagType

    this.content.forEach( token => {
      if ( token.type === '#' ) {
        tagType = token.type
        symbolCount++
      } else {
        output += token.value
      }
    })

    output = new Tag({
      tagType: tagType,
      variety: 'opening',
      symbolCount: symbolCount
    }).deliver() + output

    output += new Tag({
      tagType: tagType,
      variety: 'closing',
      symbolCount: symbolCount
    }).deliver()

    return output
  }
}
