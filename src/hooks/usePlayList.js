import { useEffect, useState } from 'react'

export default function usePlayList(playlist) {
  const newPlaylist = shuffle(playlist)
  const [playlistData, setPlaylistData] = useState(null)
  const [newUrl, setNewUrl] = useState(null)
  const [answers, setAnswers] = useState(null)
  const [counter, setCounter] = useState(null)
  const [wrongAnswers, setWrongAnswers] = useState(null)

  //get playlist data
  useEffect(() => {
    const baseUrl = 'https://itunes.apple.com/lookup?id='
    Promise.all(
      newPlaylist.map(({ id }) => fetch(baseUrl + id).then(res => res.json()))
    ).then(data => {
      const newPlaylistData = data.map(({ results }) => results[0])
      const cleanPlaylistData = newPlaylistData.filter(el => {
        if (el) return el
      })
      !playlistData && setPlaylistData(cleanPlaylistData)
      setCounter(cleanPlaylistData.length - 1)
    })
  }, [])

  //get the wrong answers
  useEffect(() => {
    if (counter) {
      const interpret = playlistData[counter].artistName
      const baseUrl = `https://itunes.apple.com/search?term=${interpret}&entity=song`
      fetch(baseUrl)
        .then(res => res.json())
        .then(data => {
          const wrongSongTitle = data.results.filter(
            ({ trackName, artistName }) => {
              if (trackName === 'Undefined' || trackName === '(Un)Defined') {
                return ''
              } else if (playlistData[counter].artistName !== artistName) {
                return ''
              }
              return trackName
            }
          )
          const wrongsongTitleSet = new Set(
            wrongSongTitle.map(({ trackName }) => trackName)
          )
          setWrongAnswers([...wrongsongTitleSet])
        })
        .catch(error => console.error(error))
    }
  }, [playlistData, counter])

  //set all answers and shuffel
  useEffect(() => {
    if (wrongAnswers) {
      const rightAnswer = playlistData[counter].trackName
      const selectWrongAnswers = shuffle(
        wrongAnswers.filter(answer => answer !== rightAnswer)
      )
      const answerObj = [
        { title: rightAnswer, right: true, id: 1 },
        { title: selectWrongAnswers[0], wrong: true, id: 2 },
        { title: selectWrongAnswers[1], wrong: true, id: 3 },
      ]

      setAnswers(shuffle(answerObj))
    }
  }, [wrongAnswers])

  //set new song url
  useEffect(() => {
    if (playlistData && counter) {
      setNewUrl(playlistData[counter].previewUrl)
    }
  }, [playlistData, counter])

  //handle counter 0
  useEffect(() => {
    if (counter === 0) setCounter(playlistData.length - 1)
  }, [counter])

  //Fisher–Yates shuffle modern algorithm
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  function nextSong() {
    setCounter(counter - 1)
  }

  return { answers, newUrl, nextSong }
}
