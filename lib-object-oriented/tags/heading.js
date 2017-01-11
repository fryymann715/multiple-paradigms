export default class Heading {
  constructor( symbolCount ) {
    this.symbolCount = symbolCount
  }

  deliver() {
    return `h${this.symbolCount}`
  }
}
