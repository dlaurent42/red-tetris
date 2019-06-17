const recursiveRegex = (regex, source) => {
  const matches = []
  let result = []
  let str = source
  do {
    result = regex.exec(str)
    if (result !== null) {
      str = str.replace(result[0], '')
      matches.push(result[0])
    }
  } while (result !== null)
  return matches
}

module.exports = recursiveRegex
