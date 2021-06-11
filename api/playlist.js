const fetch = require('node-fetch')

// eslint-disable-next-line
export default async function (req, res) {
  const { id } = req.params
  const baseUrl = 'https://itunes.apple.com/lookup?id='

  let data = await fetch(baseUrl + id).then(req => req.json())
  res.status(201).json(await data)
}
