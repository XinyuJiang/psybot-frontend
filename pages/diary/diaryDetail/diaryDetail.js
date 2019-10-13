// pages/diary/diaryDetail/diaryDetail.js
const domain_w = 'https://consultant.yiwangchunyu.wang/';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    diaryid:'',
    day: '',
    other: '',
    time: '',
    label: '',
    title: '',
    content: '',
  },
  toeditdiary:function(){
    var diaryid = this.data.diaryid
    wx.redirectTo({
      url: '../editDiary/editDiary?diaryid=' + diaryid,
    })
  },
  todeletediary:function(){
    var diaryid = this.data.diaryid
    wx.showModal({
      title: '提示',
      content: '真的要删除这篇日记吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: domain_w + 'service/diary/delete',
            data: {
              id: diaryid
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post',
            success: res => {
              console.log(res.data.msg)
              wx.reLaunch({
                url: '../diary',
              })

            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var diaryid = options.diaryid
    this.setData({
      diaryid:diaryid
    })
    wx.request({
      url: domain_w + 'service/diary/list',
      data: {
        id: diaryid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success: res => {
        var resdiary = res.data.data.diary[0]
        var label_list = ['angry', 'sad', 'exhausted', 'anxious', 'neutral', 'happy', 'exciting', 'surprise', 'peace']
        this.setData({
          time: resdiary.ctime,
          label: label_list[resdiary.label],
          title: resdiary.title,
          content: resdiary.content
        })
      }
    })

  },

})