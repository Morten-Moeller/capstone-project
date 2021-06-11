var httpProxy = require('node-http-proxy')
var proxy = httpProxy.createProxyServer({})

// eslint-disable-next-line
export default function (req, res) {
  proxy.web(req, res, { target: 'https://itunes.apple.com/' })
}

// export default async function (req, res) {
//   const { id } = req.params
//   const baseUrl = 'https://itunes.apple.com/lookup?id='
//   console.log(id)
//   let data = await fetch(baseUrl + id).then(req => req.json())
//   res.status(201).json(await data)
// }
