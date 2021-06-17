// @ts-check
import { useEffect, useState } from 'react'
import getPlaylistData from '../services/getPlaylistData'
import getWrongAnswers from '../services/getWrongAnswers'
import shuffle from '../utils/shuffleArray'
/**
 *
 * @param {Array.<Object>} initialPlaylist
 * @returns answers, getNextUrl, initiateNextSong, setNewPlaylist, isLoaded
 */
export default function usePlayList(initialPlaylist) {
  const [playlist, setPlaylist] = useState(initialPlaylist)
  const [playlistData, setPlaylistData] = useState(null)
  const [answers, setAnswers] = useState(null)
  const [counter, setCounter] = useState(null)
  const [wrongAnswers, setWrongAnswers] = useState(null)
  // const [isLoaded, setIsLoaded] = useState(false)
  const isLoaded = playlist && counter && answers
  let getNextUrl

  useEffect(() => {
    if (playlist) {
      // setIsLoaded(false)
      ;(async () => {
        const data = await getPlaylistData(shuffle(playlist))
        if (data) {
          setPlaylistData(data)
          setCounter(data?.length - 1)
        }
      })()
    }
  }, [playlist])

  //get wrong answers
  useEffect(() => {
    if (counter && playlistData) {
      // setIsLoaded(true)

      ;(async () => {
        const data = await getWrongAnswers(playlistData[counter].artistId)
        if (data) {
          setWrongAnswers(data)
        }
      })()
    }
  }, [counter])

  //set all answers and shuffle
  useEffect(() => {
    if (!wrongAnswers) return
    const rightAnswer = playlistData[counter]?.trackName
    const shuffledWrongAnswers = shuffle(
      wrongAnswers.filter(answer => answer !== rightAnswer)
    )
    const allAnswers = [
      { title: rightAnswer, right: true, id: 1 },
      { title: shuffledWrongAnswers[0], wrong: true, id: 2 },
      { title: shuffledWrongAnswers[1], wrong: true, id: 3 },
    ]

    setAnswers(shuffle(allAnswers))
  }, [wrongAnswers, counter, playlistData])

  //set new song url
  if (playlistData && counter) {
    getNextUrl = playlistData[counter]?.previewUrl
  }

  resetPlaylist()

  function resetPlaylist() {
    if (counter === 0) setCounter(playlistData.length - 1)
  }

  function initiateNextSong() {
    setCounter(counter - 1)
  }

  function setNewPlaylist(newPlaylist) {
    setPlaylist(newPlaylist)
    setAnswers(null)
    setCounter(null)
  }

  return { answers, getNextUrl, initiateNextSong, setNewPlaylist, isLoaded }
}
