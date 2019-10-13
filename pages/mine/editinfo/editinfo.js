const util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    openid: '',
    user_id: '',
    info: '',
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人信息'
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
    this.setData({
      openid: app.globalData.openId,
      user_id: app.globalData.user_id,
    })
    var gender
    if (this.data.userInfo.gender == 1) gender='男'
    else gender='女'
    
    const datainfo = [
      { title: '头像', content: this.data.userInfo.avatarUrl },
      { title: '昵称', content: this.data.userInfo.nickName },
      { title: '账号', content: "PsyHack" + this.data.user_id},
      { title: '性别', content: gender },
      { title: '地区', content: this.data.userInfo.province + ' '+this.data.userInfo.city},
     ]
    this.setData({
      info:datainfo,
    })

  },
})
