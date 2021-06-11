import { useEffect, useState } from 'react'
import getPlaylistData from '../utils/getPlaylistData'
import shuffle from '../utils/shuffleArray'

export default function usePlayList(playlist) {
  const newPlaylist = shuffle(playlist)
  const [playlistData, setPlaylistData] = useState(null)
  const [answers, setAnswers] = useState(null)
  const [counter, setCounter] = useState(null)
  const [wrongAnswers, setWrongAnswers] = useState(null)
  let getNextUrl

  //try with redirect
  useEffect(() => {
    const baseUrl = '/api/lookup?id='
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

  //get playlist data
  // useEffect(() => {
  //   const baseUrl = 'https://itunes.apple.com/lookup?id='
  //   Promise.all(
  //     newPlaylist.map(({ id }) => fetch(baseUrl + id).then(res => res.json()))
  //   ).then(data => {
  //     const newPlaylistData = data.map(({ results }) => results[0])
  //     const cleanPlaylistData = newPlaylistData.filter(el => {
  //       if (el) return el
  //     })
  //     !playlistData && setPlaylistData(cleanPlaylistData)
  //     setCounter(cleanPlaylistData.length - 1)
  //   })
  // }, [])

  //get the wrong answers
  useEffect(() => {
    if (!counter) return
    const interpret = playlistData[counter].artistName
    const baseUrl = `https://itunes.apple.com/search?term=${interpret}&entity=song`
    fetch(baseUrl)
      .then(res => res.json())
      .then(data => {
        const wrongSongTitle = data.results.filter(
          ({ trackName, artistName }) => {
            if (
              trackName === 'Undefined' ||
              trackName === '(Un)Defined' ||
              playlistData[counter].artistName !== artistName
            ) {
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
  }, [playlistData, counter])

  //set all answers and shuffle
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

  if (playlistData && counter) {
    getNextUrl = playlistData[counter].previewUrl
  }

  //handle counter 0
  useEffect(() => {
    if (counter === 0) setCounter(playlistData.length - 1)
  }, [counter])

  function innitiateNextSong() {
    setCounter(counter - 1)
  }

  return { answers, getNextUrl, innitiateNextSong }
}
