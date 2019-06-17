const dynamicSort = (property) => {
  let sortOrder = 1
  let prop = property
  if (prop[0] === '-') {
    sortOrder = -1
    prop = prop.substr(1)
  }
  return (a, b) => {
    if (a[prop] < b[prop]) return -1 * sortOrder
    if (a[prop] > b[prop]) return sortOrder
    return 0
  }
}

module.exports = dynamicSort
