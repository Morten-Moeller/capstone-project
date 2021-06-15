import React from 'react'
import Heading from './Heading'

export default {
  title: 'Heading',
  component: Heading,
}

const Template = args => <Heading {...args} />

export const DefaultHeading = Template.bind({})
DefaultHeading.args = { children: 'Juke Quest' }
