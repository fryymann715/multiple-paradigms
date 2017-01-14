export const ARROW = '>'
export const ASTERISK = '*'
export const BANG = '!'
export const CHAR = 'char'
export const DOT = '.'
export const HYPHEN = '-'
export const NEW_LINE = 'new_line'
export const NUMB = 'numb'
export const OCTOTHORP = "#"
export const SPACE = ' '
export const TICK = '`';
export const TILDE = '~'
export const UNDERSCORE = '_'
export const LEFT_BRACKET = '['
export const RIGHT_BRACKET = ']'
export const LEFT_PARENTHESIS = '('
export const RIGHT_PARENTHESIS = ')'

const splitReduce = ( characters, label ) =>
  characters.split('').reduce( ( accumulator, char ) => {
    accumulator[ char ] = label
    if ( isNaN( char ) ) { accumulator[ char.toUpperCase() ] = label }
    return accumulator
  }, {} )

const CHAR_TYPES = splitReduce( 'abcdefghijklmnopqrstuvwqxyz?,;:&^%$@=+{}\'\"', CHAR )
const NUM_TYPES = splitReduce( '0123456789', NUMB )

const TOKEN_MAP = Object.assign({},
  {
    '>': ARROW,
    '*': ASTERISK,
    '!': BANG,
    '.': DOT,
    '-': HYPHEN,
    '\n': NEW_LINE,
    '#': OCTOTHORP,
    ' ': SPACE,
    '`': TICK,
    '~': TILDE,
    '_': UNDERSCORE,
    '[': LEFT_BRACKET,
    ']': RIGHT_BRACKET,
    '(': LEFT_PARENTHESIS,
    ')': RIGHT_PARENTHESIS
  },
  CHAR_TYPES,
  NUM_TYPES
)

export default class Token {
  constructor( value ) {
    this.type = TOKEN_MAP[ value ]
    this.value = value
  }

  isMarkdown = () => {
    const typeMatch = new RegExp('([\\' +
      OCTOTHORP + '\\' +
      ARROW + '\\' +
      TICK + '\\' +
      ASTERISK + '\\' +
      HYPHEN + '\\' +
      UNDERSCORE + '\\' +
      '\\])', 'g')

    return this.type.search( typeMatch ) !== -1
  }

  isPartOflist = tagType =>
    ( tagType === HYPHEN || tagType === ASTERISK ) &&
    ( this.type !== HYPHEN || this.type !== ASTERISK )

  isPartOfCodeBlock = tagType =>
    tagType === TICK && this.type !== TICK

  shouldNotBeRemoved = tagType => {
    if ( this.isPartOfCodeBlock( tagType ) || this.isPartOflist( tagType ) ) {
      return true
    }
  }

  isPartOfMarkdownLabel = ( tagType, index, symbolCount ) =>
    tagType === this.type && index <= symbolCount

}
