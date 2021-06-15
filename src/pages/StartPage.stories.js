import React from 'react'
import StartPage from './StartPage'

export default {
  title: 'StartPage',
  component: StartPage,
}

const Template = args => <StartPage {...args} />

export const DefaultStartPage = Template.bind({})
DefaultStartPage.args = {
  playlists: [
    { id: '01', title: 'Classic Rock', playlistName: 'classicrock' },
    { id: '02', title: '70s Rock', playlistName: '70srock' },
    { id: '03', title: 'Punk Rock', playlistName: 'punkrock' },
  ],
}
