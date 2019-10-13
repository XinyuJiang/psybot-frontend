// pages/feedback/feedback.js

const app = getApp()
const domain = 'https://xinyuJiang.cn/psybot/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: '',
    windowsheight: wx.getSystemInfoSync().windowHeight,
    title_list: ['产品建议', '程序错误', '其他'],
    currentTab: 0,
  },

  clickTab: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },

  toSubmit: function (e) {
    var title_list = this.data.title_list
    var currentTab = this.data.currentTab
    var title = title_list[currentTab]
    var text = e.detail.value.content

    if (text == '') {
      wx.showToast({
        icon: 'none',
        title: '内容不能为空'
      });
      return;
    }
    else {

      console.log('title:', title)
      console.log('text:', text)
      wx.request({
        url: domain + 'setopinion/',
        data: {
          user_id: this.data.user_id,  //此处必须为userId
          text: text,
          title: title,
        },
        method: 'get',
        success: res => {
          console.log('提交成功，我们将尽早处理您的反馈内容。', res.data.msg)
          wx.showModal({
            title: '提示',
            content: '提交成功，我们将尽早处理您的反馈内容。',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
          })

        }
      })


    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '问题反馈'
    })

    this.setData({
      user_id: app.globalData.user_id,
    })

  },

})