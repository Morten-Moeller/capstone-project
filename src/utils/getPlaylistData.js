export default async function getPlaylistData(newPlaylist) {
  const baseUrl = 'https://itunes.apple.com/lookup?id='

  let response = await Promise.all(
    newPlaylist.map(({ id }) => fetch(baseUrl + id).then(res => res.json()))
  )

  let data = await response.map(({ results }) => results[0])
  let playlistBaseData = data.filter(el => !!el)
  return playlistBaseData
}
