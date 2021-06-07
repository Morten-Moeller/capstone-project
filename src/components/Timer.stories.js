import React from 'react'
import Timer from './Timer'

export default {
  title: 'Timer',
  component: Timer,
}

const Template = args => <Timer {...args} />

export const DefaultTimer = Template.bind({})
DefaultTimer.args = { duration: 30 }
