import React from 'react'
  import StyledSlider from './StyledSlider'
  
  export default {
    title: 'StyledSlider',
    component: StyledSlider,
  }
  
  const Template = args => <StyledSlider {...args} />
  
  export const DefaultStyledSlider = Template.bind({})
  DefaultStyledSlider.args = {}