// pages/mine/mine.js
const util = require('../../utils/util.js')
const app = getApp()
const domain = 'https://xinyuJiang.cn/psybot/'
const domain_w = 'https://consultant.yiwangchunyu.wang/';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    openid: '',
    user_id: '',
    user_lists:[
      { title: '个人信息', tap: 'toEditInfo' },
      { title: '情绪档案', tap:'tomyrecord'},
    ],
    program_lists:[
      { title: '意见反馈', tap: 'tofeedback' },
      { title: '关于我们', tap: 'tointroduce' },
    ],
    stat_lists: [
      { number: '-', title: '破壳天数', unit: 'days' },
      { number: '-', title: '对话条数', unit: 'mins' },
      { number: '-', title: '日记个数', unit: 'posts' },
    ],
    windowsheight: wx.getSystemInfoSync().windowHeight,
  },
  touserecord:function(){
    wx.navigateTo({
      url: 'userecord/userecord',
    })
  },
  tomyrecord:function(){
    wx.navigateTo({
      url: 'myrecord/myrecord',
    })
  },
  tofeedback:function(){
    wx.navigateTo({
      url: 'feedback/feedback',
    })
  },
  tointroduce:function(){
    wx.navigateTo({
      url: 'introduce/introduce',
    })
  },
  toEditInfo:function(){
    wx.navigateTo({
      url: 'editinfo/editinfo',
    })
  },
  
  /**
   * 获取天数（基本信息）
   */
  getDays:function(){
    //获取天数和条数
    wx.request({
      url: domain + 'daysrecord/',
      method: 'GET',
      data: {
        user_id: this.data.user_id
      },
      success: res => {
        console.log("破壳天数以及对话条数",res.data.data)
        var number = res.data.data.days
        var text = res.data.data.text

        wx.request({
          url: domain_w + 'service/diary/list',
          data: {
            user_id: this.data.user_id
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          success: res => {
            console.log('日记详情', res.data.data)
             var resdiary = res.data.data.diary

            this.setData(
              {
                stat_lists:
                  [{ number: number, title: '破壳天数', unit: 'days' },
                  { number: text, title: '对话条数', unit: 'mins' },
                    { number: resdiary.length , title: '日记篇数', unit: 'posts' },
                  ]
              })


          }
        })


      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    })
    //获取user_id
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
  onShow:function(){
    this.getDays()
  },
  onPullDownRefresh:function(){
    console.log("刷新");
    wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
    this.getDays()
    wx.hideNavigationBarLoading();//隐藏导航条加载动画。
    wx.stopPullDownRefresh();//停止当前页面下拉刷新。
    console.log("关闭");

  }

})