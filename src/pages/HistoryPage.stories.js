import React from 'react'
  import HistoryPage from './HistoryPage'
  
  export default {
    title: 'HistoryPage',
    component: HistoryPage,
  }
  
  const Template = args => <HistoryPage {...args} />
  
  export const DefaultHistoryPage = Template.bind({})
  DefaultHistoryPage.args = {}