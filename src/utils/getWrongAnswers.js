// @ts-check

export default async function getWrongAnswers(interpret) {
  const baseUrl = `/api/artist/${interpret}`
  const response = await fetch(baseUrl).then(res => res.json())

  const trackList = response.results.filter(({ trackName, artistName }) => {
    if (
      trackName === 'Undefined' ||
      trackName === '(Un)Defined' ||
      interpret !== artistName
    ) {
      return ''
    }
    return trackName
  })

  const wrongsongTitleSet = new Set(trackList.map(({ trackName }) => trackName))

  return [...wrongsongTitleSet]
}
