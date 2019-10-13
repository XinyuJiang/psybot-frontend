// pages/diary/newDiary/newDiary.js
const util = require('../../../utils/util.js')
const domain_w = 'https://consultant.yiwangchunyu.wang/';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: '',
    date: '',
    week: '',
    label_list: ['angry', 'sad', 'exhausted', 'anxious', 'neutral', 'happy', 'exciting', 'surprise', 'peace'],
    label_list1: ['angry', 'sad', 'exhausted'],
    label_list2: ['anxious', 'neutral','happy'],
    label_list3: ['exciting', 'surprise', 'peace'],
    label_text: 'happy',
    label_number:5,
    is_choosing_Label:false,
  },
  changelabel:function(){
    this.setData({
      is_choosing_Label: true
    })
  },
  confirmLabel:function(e){

    var index = e.currentTarget.dataset.label
    var label_list = this.data.label_list
    console.log(e.currentTarget.dataset.label)
    this.setData({
      is_choosing_Label: false,
      label_text: label_list[index],
      label_number:index,
    })

  },
  onLoad: function () {
    //y页面初始化时加载的原始数据
    // 设置标题

    var diaryTime = util.diaryTime_new(new Date())

    this.setData({
      date: diaryTime.date,
      week: diaryTime.week,
      user_id: app.globalData.user_id
    })
    //console.log(diaryTime)
  },
  bindFormSubmit: function (e) {
    console.log(e.detail.value)
    var title = e.detail.value.title
    var content = e.detail.value.content
    if (title == '') {
      wx.showToast({
        icon: 'none',
        title: '标题不能为空'
      });
      return;
    }
    else if (content == '') {
      wx.showToast({
        icon: 'none',
        title: '内容不能为空'
      });
      return;
    }
    else {
      console.log(this.data.user_id)
      console.log(this.data.label_number)
      console.log(title)
      console.log(content)

        wx.request({
          url: domain_w + 'service/diary/create',
          data: {
            user_id: this.data.user_id,
            label: this.data.label_number,
            title: title,
            content: content,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          success: function (res) {
            console.log('日记id', res.data.data.id)
            wx.showToast({
              title:'',
              icon: 'success',
              duration: 6000,
              success: function () {
                wx.reLaunch({
                  url: '../diary',
                })
              }
            });
          }
        })

    }
  },

 
})