const isEmpty = (any) => {
  if (!any) return true
  if (typeof any === 'undefined') return true
  if (any.length === 0) return true
  if (JSON.stringify(any) === '{}') return true
  return false
}

module.exports = isEmpty
