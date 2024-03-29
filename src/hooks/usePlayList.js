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
  const isLoaded = Boolean(playlist && answers)

  useEffect(() => {
    if (playlist) {
      ;(async () => {
        const data = await getPlaylistData(shuffle(playlist))
        if (data) {
          setPlaylistData(data)
          setCounter(data?.length)
        }
      })()
    }
  }, [playlist])

  //get wrong answers
  useEffect(() => {
    if (counter && playlistData) {
      ;(async () => {
        const data = await getWrongAnswers(playlistData[counter - 1].artistId)
        if (data) {
          setWrongAnswers(data)
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter])

  //set all answers and shuffle
  useEffect(() => {
    if (!wrongAnswers) return
    const rightAnswer = playlistData[counter - 1]?.trackName
    const shuffledWrongAnswers = shuffle(
      wrongAnswers.filter(answer => answer !== rightAnswer)
    )
    const allAnswers = [
      { title: rightAnswer, state: 'right', id: 1 },
      { title: shuffledWrongAnswers[0], state: 'wrong', id: 2 },
      { title: shuffledWrongAnswers[1], state: 'wrong', id: 3 },
    ]

    setAnswers(shuffle(allAnswers))
  }, [wrongAnswers, counter, playlistData])

  //set new song url
  function getNextUrl() {
    if (playlistData && counter) {
      return playlistData[counter - 1]?.previewUrl
    }
  }

  function initiateNextSong() {
    if (counter > 0) {
      setCounter(counter => counter - 1)
    } else {
      setCounter(0)
      setPlaylist(null)
    }
  }

  function setNewPlaylist(newPlaylist) {
    setPlaylist(newPlaylist)
    setAnswers(null)
    setCounter(null)
  }

  return {
    answers,
    getNextUrl,
    initiateNextSong,
    setNewPlaylist,
    isLoaded,
    counter,
  }
}
