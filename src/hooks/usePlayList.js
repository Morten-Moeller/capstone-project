import { useEffect, useState } from 'react'

export default function usePlayList(playList) {
  const playListCopy = [...playList]
  const [songList, setSongList] = useState(shuffle([...playList]))
  const [newUrl, setNewUrl] = useState(null)
  const [songId, setSongId] = useState(
    playList[Math.floor(Math.random() * playList.length)].id
  )
  const [rightAnswer, setRightAnswer] = useState()
  const [wrongAnswers, setWrongAnswers] = useState([
    { title: 'Angel Eyes' },
    { title: 'Backstreets' },
  ])
  const [answers, setAnswers] = useState(null)

  //check songId for valid song
  useEffect(() => {
    const baseUrl = `https://itunes.apple.com/lookup?id=${songList[0].id}`
    songList[0].id &&
      fetch(baseUrl)
        .then(res => res.json())
        .then(data => data.results.length === 0 && removeSong(songList[0].id))
        .catch(error => console.error(error))
  }, [songId])

  // set next song
  useEffect(() => {
    console.log(songList)
    console.log(playListCopy)
    songList.length > '1'
      ? setSongList(removeSong(songId))
      : setSongList(shuffle(playListCopy))
  }, [songId])

  //get the wrong answers
  useEffect(() => {
    if (rightAnswer) {
      const interpret = rightAnswer.interpret
      const baseUrl = `https://itunes.apple.com/search?term=${interpret}&entity=song`
      fetch(baseUrl)
        .then(res => res.json())
        .then(data => {
          let answer1
          let answer2
          do {
            answer1 = {
              title:
                data.results[Math.floor(Math.random() * data.results.length)]
                  .trackName,
            }
            answer2 = {
              title:
                data.results[Math.floor(Math.random() * data.results.length)]
                  .trackName,
            }
          } while (
            answer1.title === answer2.title ||
            answer1.title === rightAnswer.title ||
            answer2.title === rightAnswer.title ||
            answer1.title === rightAnswer.interpret ||
            answer2.title === rightAnswer.interpret
          )
          setWrongAnswers([answer1, answer2])
        })
        .catch(error => console.error(error))
    }
  }, [rightAnswer])

  //Get right song and artistName
  useEffect(() => {
    const baseUrl = 'https://itunes.apple.com/lookup?id='
    fetch(baseUrl + songId)
      .then(res => res.json())
      .then(data => {
        setNewUrl(data.results[0].previewUrl)
        setRightAnswer({
          title: data.results[0].trackName,
          right: true,
          interpret: data.results[0].artistName,
        })
      })
      .catch(error => console.error(error))
  }, [songId])

  // shuffle and set answers
  useEffect(() => {
    if (rightAnswer) {
      const answer = [
        { title: wrongAnswers[0].title, wrong: true },
        { title: wrongAnswers[1].title, wrong: true },
        { title: rightAnswer.title, right: true },
      ]
      setAnswers(shuffle(answer))
    }
  }, [rightAnswer, wrongAnswers])

  function removeSong(removeId) {
    const index = songList.findIndex(({ id }) => id === removeId)
    const newSongList = songList
    const removedSong = newSongList.splice(index, 1)
    return newSongList
  }

  function nextSong() {
    setSongId(songList[0].id)
  }

  //Fisher–Yates shuffle modern algorithm
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
  return { answers, newUrl, nextSong }
}
