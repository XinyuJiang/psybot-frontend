// pages/diary/newDiary/newDiary.js
const util = require('../../../utils/util.js')
const domain_w = 'https://consultant.yiwangchunyu.wang/';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    diaryid:'',
    date: '',
    week: '',
    label_list: ['angry', 'sad', 'exhausted', 'anxious', 'neutral', 'happy', 'exciting', 'surprise', 'peace'],
    label_list1: ['angry', 'sad', 'exhausted'],
    label_list2: ['anxious', 'neutral','happy'],
    label_list3: ['exciting', 'surprise', 'peace'],
    label_text: '',
    label_number:0,
    title:'',
    content:'',
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
  bindFormSubmit: function (e) {
    var diaryid = this.data.diaryid
    console.log('哈哈哈哈哈啊哈哈')
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
      console.log(this.data.diaryid)
      console.log(this.data.label_number)
      console.log(title)
      console.log(content)
      var update = {
        label: this.data.label_number,  // label: 10,
        title: title,           // title: 'xxxxx',
        content: content        // content: 'xxxxx'
      }
      wx.request({
        url: domain_w + 'service/diary/update',
        data: {
          id: diaryid,
          update: JSON.stringify(update)
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        success: function (res) {
          console.log('日记修改情况', res.data.msg)

          wx.reLaunch({
            url: '../diary',
          })

        }
      })

    }
  },
  onLoad: function (options) {
    //y页面初始化时加载的原始数据
    // 设置标题

    var diaryid = options.diaryid
    var diaryTime = util.diaryTime_new(new Date())
    console.log('修改页面日记id', diaryid)
    this.setData({
      diaryid:diaryid,
      date: diaryTime.date,
      week: diaryTime.week
    })
    //console.log(diaryTime)

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
        console.log('修改页面日记信息',resdiary)
        var label_list = ['angry', 'sad', 'exhausted', 'anxious', 'neutral', 'happy', 'exciting', 'surprise', 'peace']
        this.setData({
          label_text: label_list[resdiary.label],
          label_number: resdiary.label,
          title: resdiary.title,
          content: resdiary.content
        })
      }
    })


  }
 
})