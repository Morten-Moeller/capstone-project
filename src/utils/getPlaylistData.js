// @ts-check
export default async function getPlaylistData(newPlaylist) {
  const baseUrl = '/api/playlist/'

  let response = await Promise.all(
    newPlaylist.map(({ id }) => fetch(baseUrl + id).then(res => res.json()))
  )

  const playlistData = response.map(({ results }) => results[0])
  const cleanPlaylistData = playlistData.filter(el => !!el)
  return cleanPlaylistData
}
