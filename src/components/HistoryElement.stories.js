import React from 'react'
import HistoryElement from './HistoryElement'

export default {
  title: 'HistoryElement',
  component: HistoryElement,
}

const Template = args => <HistoryElement {...args} />

export const DefaultHistoryElement = Template.bind({})
DefaultHistoryElement.args = {
  history: {
    playerName: 'John Doe',
    date: '17. Juni 2021',
    playlistName: 'Italo Disco 80s',
    score: 1123,
  },
}
