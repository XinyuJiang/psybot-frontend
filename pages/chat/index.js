const util = require('../../utils/util.js')
const app = getApp()
const domain = 'https://xinyuJiang.cn/psybot/'
const botURL = 'https://xinyuJiang.cn/static/img/bot-head.png'
Page({
  data: {
    userInfo: {},
    openid: '',
    user_id: '',
    lists: [{
        title: '首次体验',
        tap: 'tofirst'
      },
      {
        title: '疏导模式',
        tap: 'tochat'
      },
      {
        title: '闲聊模式',
        tap: 'tosmalltalk'
      },
    ],
  },
  tofirst: function() {
    wx.navigateTo({
      url: 'first/first',
    })
  },
  tochat: function() {
    wx.navigateTo({
      url: 'chat/chat',
    })
  },
  tosmalltalk: function() {
    wx.navigateTo({
      url: 'smalltalk/smalltalk?talkmode=0',
    })
  },

  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
    this.setData({
      openid: app.globalData.openId,
      user_id: app.globalData.user_id,
    })
  },
})