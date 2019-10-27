// pages/card/card.js

const app = getApp()
const domain = 'https://xinyuJiang.cn/psybot/'
const util = require('../../utils/util.js')
// 导入海报生成组件
import Poster from '../../miniprogram_npm/wxa-plugin-canvas/poster/poster';
const windowWidth = wx.getSystemInfoSync().windowWidth * 4; // 获取当前窗口的宽度
const windowHeight = wx.getSystemInfoSync().windowHeight * 4; // 获取当前窗口的高度
// 海报绘制数据
const posterConfig = {
  cardConfig: {
    // 灰色背景
    width: windowWidth,
    height: windowHeight,
    backgroundColor: '#EDEDED',
    debug: false,
    pixelRatio: 50,
    zIndex: 0,
    blocks: [
      // 白色背景
      {
        x: windowWidth * 0.05,
        y: windowHeight * 0.05,
        width: windowWidth * 0.9,
        height: windowHeight * 0.9,
        backgroundColor: '#ffffff',
        borderRadius: 40,
        zIndex: 1,
      },
      // 邮政编码
      {
        width: windowWidth * 0.052,
        height: windowHeight * 0.037,
        x: windowWidth * (0.1 + 0.07 * 0),
        y: windowHeight * 0.37,
        borderWidth: 1,
        borderColor: '#000000',
        zIndex: 2,
      },
      {
        width: windowWidth * 0.052,
        height: windowHeight * 0.037,
        x: windowWidth * (0.1 + 0.07 * 1),
        y: windowHeight * 0.37,
        borderWidth: 1,
        borderColor: '#000000',
        zIndex: 2,
      },
      {
        width: windowWidth * 0.052,
        height: windowHeight * 0.037,
        x: windowWidth * (0.1 + 0.07 * 2),
        y: windowHeight * 0.37,
        borderWidth: 1,
        borderColor: '#000000',
        zIndex: 2,
      },
      {
        width: windowWidth * 0.052,
        height: windowHeight * 0.037,
        x: windowWidth * (0.1 + 0.07 * 3),
        y: windowHeight * 0.37,
        borderWidth: 1,
        borderColor: '#000000',
        zIndex: 2,
      },
      {
        width: windowWidth * 0.052,
        height: windowHeight * 0.037,
        x: windowWidth * (0.1 + 0.07 * 4),
        y: windowHeight * 0.37,
        borderWidth: 1,
        borderColor: '#000000',
        zIndex: 2,
      },
      {
        width: windowWidth * 0.052,
        height: windowHeight * 0.037,
        x: windowWidth * (0.1 + 0.07 * 5),
        y: windowHeight * 0.37,
        borderWidth: 1,
        borderColor: '#000000',
        zIndex: 2,
      },

    ],
    texts: [
      // 正文内容
      {
        x: windowWidth * 0.3,
        y: windowHeight * 0.55,
        width: windowWidth * 0.4,
        lineNum: 10,
        fontFamily: 'STSong',
        baseLine: 'middle',
        text: '正文',
        fontSize: 60,
        color: '#080808',
        zIndex: 2
      },
      // 名称
      {
        x: windowWidth * 0.9,
        y: windowHeight * 0.82,
        baseLine: 'top',
        text: '名称',
        fontSize: 64,
        textAlign: 'right',
        color: '#080808',
        zIndex: 2
      },
      // 日期
      {
        x: windowWidth * 0.9,
        y: windowHeight * 0.86,
        baseLine: 'top',
        text: '时间',
        fontSize: 56,
        textAlign: 'right',
        color: '#929292',
        zIndex: 2
      },
      // @psyhack
      {
        x: windowWidth * 0.9,
        y: windowHeight * 0.89,
        baseLine: 'top',
        text: '@psyhack.top',
        textAlign: 'right',
        fontSize: 56,
        color: '#929292',
        zIndex: 2
      },
    ],
    images: [
      // 背景图片
      {
        width: windowWidth * 0.9,
        height: windowHeight * 0.3,
        x: windowWidth * 0.05,
        y: windowHeight * 0.05,
        borderRadius: 40,
        url: '/pages/card/image/bg.jpg',
        zIndex: 2
      },

      // 公众号二维码
      {
        width: 280,
        height: 280,
        x: windowWidth * 0.72,
        y: windowHeight * 0.37,
        url: 'https://xinyuJiang.cn/static/img/QRcode.png',
        zIndex: 3
      },
      // 公众号LOGO
      {
        width: 240,
        height: 240,
        x: windowWidth * 0.12,
        y: windowHeight * 0.82,
        borderRadius: 200,
        url: 'https://xinyuJiang.cn/static/img/logo.png',
        zIndex: 3
      }
    ],
    lines: [{
      startY: windowHeight * 0.35,
      startX: windowWidth * 0.05,
      endX: windowWidth * 0.95,
      endY: windowHeight * 0.35,
      width: windowHeight * 0.01,
      color: 'white',
      zIndex: 3
    }]
  },
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFirst: true,
    check: true,
    photo_url: '',
    dailyText: '每日说',
    date: '',
    userInfo:{},
    modalName: '',
    posterConfig: posterConfig.cardConfig,
    CustomBar: app.globalData.CustomBar,
  },

  // todo:跳转至首页
  toNavigation: function() {
    wx.reLaunch({
      url: '../navigation/navigation'
    })
  },

  // 获取每日图片和文字
  dailyInfo: function() {
    var textID = util.currentDay(new Date)
    console.log("每日推荐序号", textID)
    wx.request({
      url: domain + 'dailyrecommend/',
      method: 'GET',
      success: res => {
        var dailyText = res.data.data[textID].text.replace(/，/g, "\n").replace(/。/g, "\n\n").replace(/,/g, "\n").replace(/!/g, "\n").replace(/----/g, "\t---- ").replace(/;/g, "\n\n").replace(/:/g, "\n").replace(/：/g, "\n").replace(/；/g, "\n\n")
        var that = this
        that.setData({
          dailyText: dailyText,
          photo_url: res.data.data[textID].photo_url
        })
      }
    })
    this.setData({
      date: util.shareTime(new Date())
    })
  },

  showSucModal() {
    this.setData({
      modalName: "Success"
    })
  },
  showWaitModal() {
    this.setData({
      modalName: "Wait"
    })
  },
  showFailModal() {
    this.setData({
      modalName: "Fail"
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  // 生成海报，todo:保存至本地
  onCreatePoster() {
    // 动态更新海报信息
    posterConfig.cardConfig.texts[0].text = this.data.dailyText;
    posterConfig.cardConfig.texts[1].text = this.data.userInfo.nickName;
    posterConfig.cardConfig.texts[2].text = this.data.date;
    posterConfig.cardConfig.images[0].url = this.data.photo_url;
    this.setData({
      posterConfig: posterConfig.cardConfig
    }, () => {
      Poster.create(true);
    });
  },

  onPosterSuccess(e) {
    const {
      detail
    } = e;
    console.log(detail)
    // 绘制耗时，延时
    var that = this
    setTimeout(function() {
      // 获取用户设置
      wx.getSetting({
        success(res) {
          // 如果用户之前拒绝了授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.openSetting({
              success(tag) {
                // 用户在设置页选择同意授权
                if (tag.authSetting["scope.writePhotosAlbum"]) {}
              }
            });
          }
        }
      })
      //  保存图片到本地
      that.showWaitModal()
      console.log(detail)
      wx.getImageInfo({
        src: detail,
        success: function(res) {
          var path = res.path;
          wx.saveImageToPhotosAlbum({
            filePath: path,
            success(res) {
              console.log(res)
              that.showSucModal()
            },
            fail(res) {
              that.showFailModal()
            }
          })
        },
        fail: function(res) {
          that.showFailModal()
        }
      })
    }, 1);
  },

  onLoad: function() {
    //页面初始化时加载的原始数据????
    // 设置标题
    wx.setNavigationBarTitle({
      title: '每日说'
    });
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.dailyInfo();
  },
})