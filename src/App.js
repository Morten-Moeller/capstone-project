import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useAudio from './hooks/useAudio'
import PlayPage from './pages/PlayPage'
import playlist from './data/playlist.json'

function App() {
  const [songList, setSongList] = useState(shuffle([...playlist]))
  const [newUrl, setNewUrl] = useState(null)
  const [songId, setSongId] = useState('1449299027')
  const [rightAnswer, setRightAnswer] = useState()
  const [wrongAnswers, setWrongAnswers] = useState([
    { title: 'Angel Eyes' },
    { title: 'Backstreets' },
  ])
  const [answers, setAnswers] = useState([
    { title: 'Button A', right: true },
    { title: 'Button B', wrong: true },
    { title: 'Button C', wrong: true },
  ])

  //set next song
  useEffect(() => {
    console.log(songList)
    const index = songList.findIndex(({ id }) => id === songId)
    const removedSong = songList.splice(index, 1)
    console.log(songList.length)
    console.log(playlist)
    songList.length > '0'
      ? setSongList(songList)
      : setSongList(shuffle([...playlist]))
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

  //set a new song
  useEffect(() => {
    songUrl(newUrl)
  }, [newUrl])

  const [showAnswer, setShowAnswer] = useState(false)

  // set the answer object in shuffled order for the buttons
  useEffect(() => {
    if (rightAnswer && !showAnswer) {
      const answer = [
        { title: wrongAnswers[0].title, wrong: true },
        { title: rightAnswer.title, right: true },
        { title: wrongAnswers[1].title, wrong: true },
      ]
      setAnswers(shuffle(answer))
    }
  }, [rightAnswer, wrongAnswers, showAnswer])

  const { songUrl, toggle, stop, playing, duration } = useAudio()

  return (
    <Container>
      <PlayPage
        showAnswer={showAnswer}
        answers={answers}
        onPlay={handlePlay}
        onAnswer={handleAnswer}
        playing={playing}
        duration={duration}
      />
    </Container>
  )

  function handleAnswer() {
    if (playing) {
      stop()
      setShowAnswer(true)
      console.log(songList)
      setSongId(songList[0].id)
    }

    return
  }

  function handlePlay() {
    !playing && toggle()
    if (showAnswer) {
      setShowAnswer(false)
    }
  }

  //Fisher–Yates shuffle modern algorithm
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
}

const Container = styled.main`
  display: grid;
`

export default App
