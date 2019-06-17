const timeoutPromise = (ms, promise, value) => {
  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise((resolve) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      console.log(`Promise not responding afer ${ms} ms...`)
      resolve(value)
    }, ms)
  })

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout,
  ])
}

module.exports = timeoutPromise
