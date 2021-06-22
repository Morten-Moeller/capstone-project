const fetch = require('node-fetch')

//eslint-disable-next-line
export default async function (req, res) {
  const query = req.query.id
  let playlistsData = {}
  const playlist = Object.keys(playlistsData).find(key => key === query)

  if (playlist) {
    return res.send(playlistsData[playlist].json())
  } else {
    const baseUrl = `https://itunes.apple.com/lookup?id=${query}`
    const apiCall = await fetch(baseUrl)
    if (apiCall.ok) {
      playlistsData = { ...playlistsData, query: apiCall }
      return res.send(await apiCall.json())
    } else {
      return res.status(apiCall.status).end()
    }
  }
}
