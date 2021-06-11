import reactDom from 'react-dom'

const fetch = require('node-fetch')

export default function (req, res) {
  const id = req.params
  res.json(id)
}
