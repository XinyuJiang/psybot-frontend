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
    week:'',
    weatherData: '',
    weatherSuggestion: '',
    location:'地球上的某个角落',
    lon: '',
    lat: '',
    location_length: 150,
    images:'',
    label_list: [
      { text: '生气', color: '#f15959', backgroundcolor: '#fae9e9' },
      { text: '难过', color: '#18e2d1', backgroundcolor: '#eefcfb' },
      { text: '疲惫', color: '#18a2e2', backgroundcolor: '#ebf6fc' },
      { text: '焦虑', color: '#e27a18', backgroundcolor: '#fcf4ed' },
      { text: '平静', color: '#27da2f', backgroundcolor: '#f0fff0' },
      { text: '开心', color: '#f75bb0', backgroundcolor: '#fff0f8' },
      { text: '兴奋', color: '#f7c65b', backgroundcolor: '#fffaf0' },
      { text: '惊喜', color: '#822dc7', backgroundcolor: '#f4ebfc' },
      { text: '无感', color: '#545752', backgroundcolor: '#f0f0f0' }],

  },
  preview: function (e) {
    wx.previewImage({
      current: e.target.dataset.id,
      urls: this.data.images
    })
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
        console.log(res)
        var resdiary = res.data.data.diary[0]
        console.log("显示：", resdiary.loc)
        if (resdiary.loc) {
            var location_length = JSON.parse(resdiary.loc).name.length
            this.setData({
              location: JSON.parse(resdiary.loc).name,
              location_length: location_length * 14 + 40,
              lon: JSON.parse(resdiary.loc).lon,
              lat: JSON.parse(resdiary.loc).lat
            })
         }

        this.setData({
          time: resdiary.ctime,
          label: resdiary.label,
          title: resdiary.title,
          week: resdiary.ctime_weekday,
          content: resdiary.content,
          images: resdiary.images,
        })
      }
    })

  },

})