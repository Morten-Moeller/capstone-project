import React from 'react'
import StartPage from './StartPage'

export default {
  title: 'StartPage',
  component: StartPage,
}

const Template = args => <StartPage {...args} />

export const DefaultStartPage = Template.bind({})
DefaultStartPage.args = {}
