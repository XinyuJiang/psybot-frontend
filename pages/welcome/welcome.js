// pages/welcome/welcome.js


// todo: 改成每日说分享页面 share



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
    dailyText: '每日说',
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
      title: '每日说'
    });

  },     



  

})
