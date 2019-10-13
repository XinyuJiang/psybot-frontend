// pages/playaudio/playaudio.js
var audioManager
const domain = 'https://xinyuJiang.cn/psybot/'
var playing = true
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    choice: 0,
    singer: 'PsyHack',
    title: '',
    playing: true,
    src: '',
    poster:'',
    progress:'',
    mingxiang_start: '',
    mingxiang_end: '',
    mingxiang_res: '',
    mingxiang_type: '',
    is_submited:'',
  },

  toSubmitMingxiangData:function(choice){

    this.setData({
      mingxiang_end: util.backendTime(new Date()),
    })
    var that = this
    console.log('存储正念冥想数据')
    wx.request({
      url: domain + 'setmingxiang/',
      data: {
        openid: that.data.openId,
        mingxiang_start: that.data.mingxiang_start,
        mingxiang_end: that.data.mingxiang_end,
        mingxiang_type: that.data.title,
        mingxiang_response: '【前端反馈】主动冥想，无冥想反思',
      },
      method: 'get',
      success(res) {
        console.log('冥想数据存储结果:', res.data.msg)
        console.log('显示冥想类型：', that.data.title)
        console.log('显示冥想反馈：', '【前端反馈】主动冥想，无冥想反思')
        console.log('显示冥想开始时间：', that.data.mingxiang_start)
        console.log('显示冥想结束时间：', that.data.mingxiang_end)
        console.log('      ')

        that.setData({
          is_submited:true,
        })
        
        if(choice != 0)
        {
          console.log("开始----转到其他冥想")
          wx.redirectTo({
            url: "../playaudio/playaudio?choice=" + choice,
          })
        }

      }
    })
      
  },

  //点击播放、暂停
  playpause: function () {
    var playing2 = this.data.playing
    var choice = this.data.choice
    if (playing2) {
      audioManager.pause()
       
      this.toSubmitMingxiangData(0)
      
    } 
    else {
      this.setData({
        mingxiang_start: util.backendTime(new Date()),
        is_submited:false,
      })
      console.log('冥想开始时间：', this.data.mingxiang_start)

      audioManager.play()
    }
  },
  tolast: function () {
    var playing2 = this.data.playing
    var choice = this.data.choice - 1
    if (choice == 0) choice = 7;
    if (playing2) audioManager.pause()

    this.toSubmitMingxiangData(choice)
 
  },
  tonext: function () {
    var playing2 = this.data.playing
    var choice = this.data.choice - 1 + 2
    if (choice == 8) choice = 1
    if (playing2) audioManager.pause()

    this.toSubmitMingxiangData(choice)

  },
   /**
   * 退出页面停止音乐
   */
  onUnload:function(){

    var is_submited = this.data.is_submited

    console.log("退出界面")

    audioManager.pause()
    if(!is_submited)  this.toSubmitMingxiangData(0)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '播放'
    })
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
    }
    else {
      console.log('进入chat时的openid', app.globalData.openId)
      console.log('Miss OpenId', app.globalData)
    }

    var title
    if (options.choice == 1) title = '呼吸冥想';
    else if (options.choice == 2) title = '晚间冥想';
    else if (options.choice == 3) title = '晨间冥想';
    else if (options.choice == 4) title = '行走冥想';
    else if (options.choice == 5) title = '乘车冥想';
    else if (options.choice == 6) title = '正念减肥';
    else if (options.choice == 7) title = '缓解焦虑';
    this.setData({
      choice: options.choice,
      title: title
    })
    console.log(this.data.choice);
    console.log(this.data.title);


    var that = this
    audioManager = wx.getBackgroundAudioManager()
    audioManager.title = this.data.title;

    console.log('全局音乐名：'+app.globalData.title)
    audioManager.epname = '正念冥想';
    audioManager.singer = 'PsyHack';
  

    var source;
    var poster;
    var choice = this.data.choice
    if (choice == 1) {
      source = 'https://xinyujiang.cn/static/mingxiang/1.mp3';
      poster = 'https://xinyujiang.cn/media/background/1.jpg'
      }
    else if (choice == 2) {
      source = 'https://xinyujiang.cn/static/mingxiang/2.mp3';
      poster = 'https://xinyujiang.cn/media/background/2.jpg'
    }
    else if (choice == 3) {
      source = 'https://xinyujiang.cn/static/mingxiang/3.mp3';
      poster = 'https://xinyujiang.cn/media/background/3.jpg';
      }
     else if (choice == 4) {
       source = 'https://xinyujiang.cn/static/mingxiang/4.mp3';
      poster = 'https://xinyujiang.cn/media/background/4.jpg';
     }
    else if (choice == 5) {
      source = 'https://xinyujiang.cn/static/mingxiang/5.mp3';
      poster = 'https://xinyujiang.cn/media/background/5.jpg';
      }
    else if (choice == 6) {
      source = 'https://xinyujiang.cn/static/mingxiang/6.mp3';
      poster = 'https://xinyujiang.cn/media/background/6.jpg';
      }
    else if (choice == 7) {
      source = 'https://xinyujiang.cn/static/mingxiang/7.mp3';
      poster = 'https://xinyujiang.cn/media/background/7.jpg';
    }
    this.setData({
      mingxiang_start: util.backendTime(new Date()),
      poster:poster,
      is_submited:false,
    })
    console.log('冥想开始时间：',this.data.mingxiang_start)
    audioManager.src = source;
    audioManager.coverImgUrl = poster
    audioManager.play()


    audioManager.onPlay(() => {
      console.log('onPlay')
      playing = true
      that.data.playing = true
      that.setData({
        playing: that.data.playing
      })
    })
    audioManager.onPause(() => {
      console.log('onPause')
      playing = false
      that.data.playing = false
      that.setData({
        playing: that.data.playing
      })
    })
    //播放结束
    audioManager.onEnded(() => {
      console.log("onEnded")
      playing = false
      that.data.progress = 100
      that.data.playing = false
      that.setData({
        playing: that.data.playing
      })
    })
    audioManager.onWaiting(() => {
      console.log('onWaiting')
      playing = false
      that.data.playing = false
      that.setData({
        playing: that.data.playing
      })
    })
    //播放进度
    audioManager.onTimeUpdate(() => {
      that.data.progress = Math.round(100 * audioManager.currentTime / audioManager.duration)
      app.globalData.progress = that.data.progress
      //console.log('进度', audioManager.currentTime + "  " + audioManager.duration)
      that.setData({
        progress: that.data.progress
      })
    })
    //播放错误
    audioManager.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      playing = false
      that.data.playing = false
      that.setData({
        playing: that.data.playing
      })
      wx.showToast({
        title: '错误:' + res.errMsg,
        icon: "none"
      })
    })

  },
})
