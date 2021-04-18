
export const findAllBrackets = (v: string): any => {
  const ANGLED_BRACKET_RE_GLOBAL = /<([^>]+)>/g
  const SQUARE_BRACKET_RE_GLOBAL = /\[([^\]]+)\]/g

  const res = []

  const parse = (match: string[]): object => {
    let variadic = false
    let value = match[1]
    if (value.startsWith('...')) {
      value = value.slice(3)
      variadic = true
    }
    return {
      required: match[0].startsWith('<'),
      value,
      variadic
    }
  }

  let angledMatch
  while (((angledMatch = ANGLED_BRACKET_RE_GLOBAL.exec(v)) != null)) {
    res.push(parse(angledMatch))
  }

  let squareMatch
  while (((squareMatch = SQUARE_BRACKET_RE_GLOBAL.exec(v)) != null)) {
    res.push(parse(squareMatch))
  }

  return res
}
