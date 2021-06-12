import { useEffect, useState } from 'react'
import getPlaylistData from '../utils/getPlaylistData'
import getWrongAnswers from '../utils/getWrongAnswers'
import shuffle from '../utils/shuffleArray'

export default function usePlayList(playlist) {
  const newPlaylist = shuffle(playlist)
  const [playlistData, setPlaylistData] = useState(null)
  const [answers, setAnswers] = useState(null)
  const [counter, setCounter] = useState(null)
  const [wrongAnswers, setWrongAnswers] = useState(null)
  let getNextUrl

  // get playlist data
  useEffect(() => {
    async function getData() {
      const data = await getPlaylistData(newPlaylist)
      if (data) {
        setPlaylistData(data)
        setCounter(data?.length - 1)
      }
    }
    getData()
  }, [newPlaylist])

  //get wrong answers
  useEffect(() => {
    if (!counter) return
    async function getData() {
      const data = await getWrongAnswers(playlistData[counter].artistName)
      if (data) {
        setWrongAnswers(data)
      }
    }
    getData()
  }, [counter, playlistData])

  //set all answers and shuffle
  useEffect(() => {
    if (!wrongAnswers) return
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
  }, [wrongAnswers, counter, playlistData])

  //set new song url
  if (playlistData && counter) {
    getNextUrl = playlistData[counter].previewUrl
  }

  //reset playlist
  if (counter === 0) setCounter(playlistData.length - 1)

  function innitiateNextSong() {
    setCounter(counter - 1)
  }

  return { answers, getNextUrl, innitiateNextSong }
}
