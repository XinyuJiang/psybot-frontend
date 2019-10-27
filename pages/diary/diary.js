// pages/diary/diary.js
const domain_w = 'https://consultant.yiwangchunyu.wang/';
const app = getApp()

Page({
  data: {
    user_id: '',
    alldiary:'',
    resdiary:'',
    is_null:'',
    label_list :[
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


  todetail: function (e) {
    var diaryid = e.currentTarget.dataset.diaryid
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
            var single_diary = {
              id: resdiary[i].id,
              time: time,
              label: resdiary[i].label,
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
  var monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  if (month == '01') monthstring = monthNames[0]
  else if (month == '02') monthstring = monthNames[1]
  else if (month == '03') monthstring = monthNames[2]
  else if (month == '04') monthstring = monthNames[3]
  else if (month == '05') monthstring = monthNames[4]
  else if (month == '06') monthstring = monthNames[5]
  else if (month == '07') monthstring = monthNames[6]
  else if (month == '08') monthstring = monthNames[7]
  else if (month == '09') monthstring = monthNames[8]
  else if (month == '10') monthstring = monthNames[9]
  else if (month == '11') monthstring = monthNames[10]
  else if (month == '12') monthstring = monthNames[11]

  return monthstring
}
