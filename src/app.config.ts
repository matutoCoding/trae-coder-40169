export default defineAppConfig({
  pages: [
    'pages/business/index',
    'pages/follow/index',
    'pages/review/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2BA471',
    navigationBarTitleText: '药店医保通',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2BA471',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/business/index',
        text: '今日经营'
      },
      {
        pagePath: 'pages/follow/index',
        text: '权益跟进'
      },
      {
        pagePath: 'pages/review/index',
        text: '班后复盘'
      }
    ]
  }
})
