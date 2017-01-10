export default class ooParser {
  constructor ( fileContents ) {
    this.content = fileContents
    this.parseMap = {
    }
  }

  outputMarkdown() {
    let output = '',
        lineAccumulator = ''
    const content = this.content,
          lines = this.content.split('\n'),

    lines.forEach( line => {
      if ( content.search(/([#])/g) === -1 ) {
        lineAccumulator += line
      }
    })

    return output
  }

  paragraph( content ) {}

}
