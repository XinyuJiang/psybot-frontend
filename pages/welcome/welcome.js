// pages/welcome/welcome.js
const app=getApp()
const domain = 'https://xinyuJiang.cn/'
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFirst:true,
    check:true,
    dailyText: '每日推荐',
  },
  tonavigation: function () {
    clearInterval(this.data.Time)
    wx.reLaunch({
      url: '../navigation/navigation'
    })
  },
  onLoad: function () {
    //y页面初始化时加载的原始数据
    // 设置标题
    wx.setNavigationBarTitle({
      title: '每日一句'
    });

this.dailyText()

  },     



  dailyText: function () {
    //获取每日推荐文本
    //var randomNum = Math.random() * 31;
    var textID = util.currentDay(new Date)
    console.log("每日推荐序号",textID)
    wx.request({
      url: domain + 'psybot/dailyrecommend/',
      method: 'GET',
      success: res => {
        var dailyText = res.data.data[textID].text.replace(/，/g, "\n").replace(/。/g, "\n\n").replace(/,/g, "\n").replace(/——/g, "  ——")
        var that = this
        that.setData({
          dailyText: dailyText,
          photo_url: res.data.data[textID].photo_url
        })
      }

    })
  }

})
