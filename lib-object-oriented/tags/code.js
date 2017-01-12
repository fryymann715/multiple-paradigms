export default class CodeBlock {
  constructor( symbolCount ) {
    this.symbolCount = symbolCount
  }

  deliver() {
    return this.symbolCount >= 3 ? 'pre' : 'code'
  }
}
