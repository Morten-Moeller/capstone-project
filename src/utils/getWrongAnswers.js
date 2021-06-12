// @ts-check

export default async function getWrongAnswers(interpret) {
  const baseUrl = `/api/artist/${interpret}`
  let response = await fetch(baseUrl).then(res => res.json())

  let data = await response.results.filter(({ trackName, artistName }) => {
    if (
      trackName === 'Undefined' ||
      trackName === '(Un)Defined' ||
      interpret !== artistName
    ) {
      return ''
    }
    return trackName
  })

  let wrongsongTitleSet = new Set(data.map(({ trackName }) => trackName))

  return [...wrongsongTitleSet]
}
