const fetch = require('node-fetch')

//eslint-disable-next-line
export default async function (req, res) {
  const baseUrl = `https://itunes.apple.com/search?term=${req.query.name}&entity=song`

  const apiCall = await fetch(baseUrl)
  if (apiCall.status === 200) {
    return res.send(await apiCall.json())
  } else {
    return res.status(apiCall.status)
  }
}
