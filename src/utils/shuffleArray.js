// @ts-check
//Fisher–Yates shuffle modern algorithm
export default function shuffle(array) {
  const arrayCopy = [...array]
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]]
  }
  return arrayCopy
}
