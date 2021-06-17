//@ts-check
export default function calcPoints(time) {
  const remain = 30 - time
  const points = (remain / 3) * 10
  return Math.floor(points)
}
