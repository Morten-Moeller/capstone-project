// @ts-check

export default async function getWrongAnswers(artistId) {
  const baseUrl = `/api/artist/${artistId}`
  const response = await fetch(baseUrl).then(res => res.json())

  const trackList = response.results.filter(({ trackName, artistName }) => {
    if (trackName === 'Undefined' || trackName === '(Un)Defined') {
      return ''
    }
    return trackName
  })

  const wrongsongTitleSet = new Set(trackList.map(({ trackName }) => trackName))

  return [...wrongsongTitleSet]
}
