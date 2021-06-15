import React from 'react'
  import Navigation from './Navigation'
  
  export default {
    title: 'Navigation',
    component: Navigation,
  }
  
  const Template = args => <Navigation {...args} />
  
  export const DefaultNavigation = Template.bind({})
  DefaultNavigation.args = {}