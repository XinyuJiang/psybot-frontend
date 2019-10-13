// pages/diary/diary.js
const domain_w = 'https://consultant.yiwangchunyu.wang/';
const app = getApp()

Page({
  data: {
    user_id: '',
    alldiary:'',
    resdiary:'',
    is_null:'',
  },


  todetail: function (e) {
    var diaryid = e.currentTarget.dataset.diaryid
    console.log(diaryid)

    wx.navigateTo({
      url: 'diaryDetail/diaryDetail?diaryid=' + diaryid ,
    })

  },
  
  tonewdiary: function (e) {
    if(this.data.user_id){
      wx.navigateTo({
        url: "newDiary/newDiary"
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '请登录体验日记功能',
        showCancel:false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }


  },
  onLoad: function () {
    this.setData({
      user_id: app.globalData.user_id
    })
     
    console.log('日记详情页的user_id   ',this.data.user_id)

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
        this.setData({
          resdiary: res.data.data.diary
        })
        if (this.data.resdiary.length == 0)
        {
          this.setData({
            is_null: true
          })
        }
        else{
          this.setData({
            is_null:false
          })
        var label_list = ['angry', 'sad', 'exhausted', 'anxious', 'neutral', 'happy', 'exciting', 'surprise', 'peace']

        var resdiary = this.data.resdiary
        var alldiary = []

        var date
        var time
        var i = 0;
        while (i < resdiary.length) {
          date = resdiary[i].ctime.split(" ")[0]

          var diarys = []

          while (i < resdiary.length && (resdiary[i].ctime.split(" ")[0] == date))  //判断date
          {
            time = resdiary[i].ctime.split(" ")[1]
            console.log(date, '  +++++  ', time)
            console.log('while 2')
            var single_diary = {
              id: resdiary[i].id,
              time: time,
              label: label_list[resdiary[i].label],
              title: resdiary[i].title,
              content: resdiary[i].content
            }
            diarys.push(single_diary)
            i = i + 1
          }

          var month = monthTostring(date.split("-")[1])
          var single_day = {
            day: date.split("-")[2],
            other: month + ',' + date.split("-")[0],
            diarys: diarys,
            draw_line: true
          }
          alldiary.push(single_day)

        }
        var alldiary_length = alldiary.length;
        alldiary[alldiary_length - 1].draw_line = false
        
        console.log(alldiary)
        this.setData({
          alldiary:alldiary
        })
        
        }

      }
    })
    


  }

})

function monthTostring(month) {
  var monthstring
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  if (month == '01') monthstring = 'January'
  else if (month == '02') monthstring = 'February'
  else if (month == '03') monthstring = 'March'
  else if (month == '04') monthstring = 'April'
  else if (month == '05') monthstring = 'May'
  else if (month == '06') monthstring = 'June'
  else if (month == '07') monthstring = 'July'
  else if (month == '08') monthstring = 'August'
  else if (month == '09') monthstring = 'September'
  else if (month == '10') monthstring = 'October'
  else if (month == '11') monthstring = 'November'
  else if (month == '12') monthstring = 'December'

  return monthstring
}
