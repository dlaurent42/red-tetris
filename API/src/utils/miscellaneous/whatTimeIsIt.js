const whatTimeIsIt = () => {
  const dt = new Date()
  const hh = dt.getHours().toString().length === 1 ? `0${dt.getHours()}` : dt.getHours()
  const mm = dt.getMinutes().toString().length === 1 ? `0${dt.getMinutes()}` : dt.getMinutes()
  const ss = dt.getSeconds().toString().length === 1 ? `0${dt.getSeconds()}` : dt.getSeconds()
  return `${hh}:${mm}:${ss}`
}

module.exports = whatTimeIsIt
