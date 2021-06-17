import React from 'react'
import HistoryPage from './HistoryPage'

export default {
  title: 'HistoryPage',
  component: HistoryPage,
}

const Template = args => <HistoryPage {...args} />

export const DefaultHistoryPage = Template.bind({})
DefaultHistoryPage.args = {
  history: [
    {
      playerName: 'John Doe',
      date: '17. Juni 2021',
      playlistName: 'Italo Disco 80s',
      score: 1123,
    },
    {
      playerName: 'Jane Doe',
      date: '17. Juni 2021',
      playlistName: 'Italo Disco 80s',
      score: 1312,
    },
  ],
}
