import React from 'react'
import PlayButton from './PlayButton'

export default {
  title: 'PlayButton',
  component: PlayButton,
}

const Template = args => <PlayButton {...args} />

export const DefaultPlayButton = Template.bind({})
DefaultPlayButton.args = {
  children: '>',
  url:
    'https://audio-ssl.itunes.apple.com/itunes-assets/Music/12/f7/c9/mzm.hyfizvmg.aac.p.m4a',
}
