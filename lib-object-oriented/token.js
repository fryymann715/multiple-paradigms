const ARROW = '>'
const ASTERISK = '*'
const BANG = '!'
const CHAR = 'char'
const DOT = '.'
const HYPHEN = '-'
const NEW_LINE = 'new_line'
const NUMB = 'numb'
const OCTOTHORP = "#"
const SPACE = ' '
const TICK = '`'
const TILDE = '~'
const UNDERSCORE = '_'
const LEFT_BRACKET = '['
const RIGHT_BRACKET = ']'
const LEFT_PARENTHESIS = '('
const RIGHT_PARENTHESIS = ')'

const splitReduce = ( characters, label ) =>
  characters.split('').reduce( ( accumulator, char ) => {
    accumulator[ char ] = label
    if ( isNaN( char ) ) { accumulator[ char.toUpperCase() ] = label }
    return accumulator
  }, {} )

const CHAR_TYPES = splitReduce( 'abcdefghijklmnopqrstuvwqxyz', CHAR )
const NUM_TYPES = splitReduce( '0123456789', NUMB )

const TOKEN_MAP = Object.assign({},
  {
    '>': ARROW,
    '*': ASTERISK,
    '!': BANG,
    'char': CHAR,
    '.': DOT,
    '-': HYPHEN,
    '\n': NEW_LINE,
    'numb': NUMB,
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
export { TOKEN_MAP }

export default class Token {
  constructor( type, value ) {
    this.type = type
    this.value = value
  }
}
