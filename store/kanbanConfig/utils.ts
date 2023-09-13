export const getNumberId = (() => {
  let randomNum = 2
  return (excludeIds: number[] = []) => {
    ++randomNum
    const min = 1
    const max = 100000000
    while (excludeIds.includes(randomNum)) {
      randomNum = Math.floor(Math.random() * (max - min + 1)) + min
    }

    return randomNum
  }
})()
