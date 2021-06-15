import React from 'react'
import Headline from './Headline'

export default {
  title: 'Headline',
  component: Headline,
}

const Template = args => <Headline {...args} />

export const DefaultHeading = Template.bind({})
DefaultHeading.args = { children: 'Juke Quest' }
