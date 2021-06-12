// @ts-check
export default async function getPlaylistData(newPlaylist) {
  const baseUrl = '/api/playlist/'

  let response = await Promise.all(
    newPlaylist.map(({ id }) => fetch(baseUrl + id).then(res => res.json()))
  )

  let data = response.map(({ results }) => results[0])
  let playlistBaseData = data.filter(el => !!el)
  return playlistBaseData
}
