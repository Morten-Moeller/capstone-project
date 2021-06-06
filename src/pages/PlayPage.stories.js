import React from 'react'
  import PlayPage from './PlayPage'
  
  export default {
    title: 'PlayPage',
    component: PlayPage,
  }
  
  const Template = args => <PlayPage {...args} />
  
  export const DefaultPlayPage = Template.bind({})
  DefaultPlayPage.args = {}