import React from 'react'
import Button from './Button'

export default {
  title: 'Button',
  component: Button,
}

const Template = args => <Button {...args} />

export const DefaultButton = Template.bind({})
DefaultButton.args = { children: 'Default Button' }

export const rightButton = Template.bind({})
rightButton.args = { children: 'Right answer', props: { right: true } }

export const wrongButton = Template.bind({})
wrongButton.args = { children: 'Wrong answer', props: { wrong: true } }
