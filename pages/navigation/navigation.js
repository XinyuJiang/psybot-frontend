// pages/navigation/navigation.js
const app = getApp()
const util = require('../../utils/util.js')
const domain = 'https://xinyuJiang.cn/psybot/'
const articleDomain = 'https://imgtext.psyhack.top'
Page({
  data: {
    // 是否显示每日说浮动按钮
    everydayTalkButton: true,

    // 判断是否首次进入本页面，防止模态框多次弹出
    isFist: true,

    // 下滑拉取更多文章，页面序号
    page: 0,

    // 用户信息
    userInfo: {},

    // 是否显示备用顶部导航
    swiperTapTop: false,

    // 是否到达底部
    touchBottom: false,
    // 获取到的文章数量
    articleNum:0,

    background: [
      'https://xinyuJiang.cn/static/banner/banner1.jpg',
      'https://xinyuJiang.cn/static/banner/banner2.jpg',
      'https://xinyuJiang.cn/static/banner/banner3.jpg'
    ],
    meditationImageUrl: "https://xinyuJiang.cn/static/banner/banner2.jpg",
    height: '',

    recommend: [ //type0
    ],
    articles: [ //type1
    ],

    audios: [{
        picture: "https://xinyujiang.cn/media/background/1.jpg",
        id: 1,
        music: "https://xinyujiang.cn/static/mingxiang/1.mp3",
        title: "呼吸冥想",
        content: "呼吸冥想 | 调节呼吸帮助你进行放松"
      },
      {
        picture: "https://xinyujiang.cn/media/background/2.jpg",
        id: 2,
        music: "https://xinyujiang.cn/static/mingxiang/2.mp3",
        title: "晚间冥想",
        content: "晚间冥想 | 陪伴你在入睡前进行放松"
      }
    ],
    currentTab: 0,
  },

  tolinkpage: function(e) {
    console.log("页面编号", e.target.dataset.linkpage)
    var linkpage = e.target.dataset.linkpage
    if (linkpage == 0) {
      wx.navigateTo({
        url: '/pages/chat/smalltalk/smalltalk?talkmode=0',
      })
    } else if (linkpage == 1) {
      var time = util.backendTime(new Date())
      var a = time.split(' ')[1]
      var hour = a.split(':')[0] - '0'
      console.log(time + '  ' + a + '   ' + hour)
      console.log("小时", hour)
      if (hour >= 6 && hour < 9) {
        wx.navigateTo({
          url: '/pages/playaudio/playaudio?choice=3', //晨间冥想
        })
      } else if (hour >= 9 && hour < 13) {
        wx.navigateTo({
          url: '/pages/playaudio/playaudio?choice=1', //呼吸冥想
        })
      } else if (hour >= 13 && hour < 19) {
        wx.navigateTo({
          url: '/pages/playaudio/playaudio?choice=7', //缓解焦虑
        })
      } else {
        wx.navigateTo({
          url: '/pages/playaudio/playaudio?choice=2', //晚间冥想
        })
      }

    } else {
      wx.navigateTo({
        url: '/pages/chat/chat/chat',
      })
    }

  },
  //调整图片高度
  imgHeight: function(e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width; //图片宽度
    var swiperH = winWid * imgh / imgw + "px"
    this.setData({
      height: swiperH //设置高度
    })
  },

  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  toMeditation: function() {
    this.setData({
      currentTab: 2,
    })
  },

  tokp: function(event) {
    var id = event.currentTarget.dataset.id
    console.log(id)
    var type = event.currentTarget.dataset.type
    var recommend = this.data.recommend
    var articles = this.data.articles
    if (type == 0) //推荐文章
      wx.navigateTo({
        url: "kp-web/kp-web?text=" + recommend[id].text,
      })
    else //科普文章
      wx.navigateTo({
        url: "kp-web/kp-web?text=" + articles[id].text,
      })
  },



  ////////////冥想部分/////////////////
  getAudio: function() {
    wx.request({
      url: domain + 'mingxiang_list/',
      success: res => {
        var audios = res.data.data
        var blank = {
          picture: '',
          id: 0,
          music: '',
          titile: '',
          content: ''
        }
        if (audios.length % 2 == 1) {
          console.log('返回个数为%d(奇数)', audios.length)
          audios.push(blank)
          console.log(audios)
        }
        this.setData({
          audios: res.data.data
        })
      },
      complete: res => {
        console.log('获取冥想', this.data.audios)
      }
    })
  },
  toaudio: function(e) {
    var choice = e.currentTarget.dataset.index
    console.log(choice)
    wx.navigateTo({
      url: "../playaudio/playaudio?choice=" + choice,
    })
  },

  /**
   * 文章获取--图文
   */
  getPaper: function() {
    wx.request({
      url: articleDomain + '/service/articles/list',
      method: 'POST',
      success: res => {
        console.log(res)
        this.setData({
          articles: res.data.data.articles
        })
      },
      complete: res => {
        console.log(this.data.articles)

        // 格式化时间 mtime
        // 格式化标题 desc
        // 格式化meta2数据
        // 暂时格式化作者数据
        var articles = this.data.articles
        const len = this.data.articles.length
        for (let i = 0; i < len; i++) {
          articles[i].mtime = articles[i].mtime.substring(0, 10);
          if (articles[i].desc.length > 26) {
            articles[i].desc = articles[i].desc.substring(0, 26) + '...';
          }
          articles[i].author = articles[i].author.substring(12, 17);
          articles[i].meta2 = JSON.parse(articles[i].meta2)
        }

        //文章去重
        var hash = [];
        var articles = this.data.articles
        articles = articles.reduce(function (origin, aiticle) {
          hash[aiticle['id']] ? '' : hash[aiticle['id']] = true && origin.push(aiticle);
          return origin;
        }, []);
        console.log(articles)
        this.setData({
          articles: articles
        })

        //计算推荐文章因子
        articles.sort(function (a, b) {
          var resultA = a.meta2[0]+a.meta2[2]+a.meta2[3]
          var resultB = b.meta2[0] + b.meta2[2] + b.meta2[3]

          var parameter = 1;
          var timestamp = Date.parse(new Date()) / 1000;
          if ((timestamp - a.meta2.org_ctime) < 15 * 24 * 60 * 60) {
            parameter = 0.7
          } else if ((timestamp - a.meta2.org_ctime) < 30 * 24 * 60 * 60) {
            parameter = 0.5
          } else {
            parameter = 0.1
          }
          resultA = resultA * parameter;

          parameter = 1;
          if ((timestamp - b.meta2.org_ctime) < 15 * 24 * 60 * 60) {
            parameter = 0.7
          } else if ((timestamp - a.meta2.org_ctime) < 30 * 24 * 60 * 60) {
            parameter = 0.5
          } else {
            parameter = 0.1
          }
          resultB = resultB * parameter

          return resultB-resultA;
        });
        console.log(articles)
        this.setData({
          recommend: articles
        })
        

        

      }
    })
  },

  /** 
   * 页面上拉触底事件——实现瀑布流
   */
  onReachBottom: function() {
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '加载中',
    })
    // 页数+1  
    this.setData({
      page: this.data.page + 1
    })
    wx.request({
      url: articleDomain + '/service/articles/list?page=' + this.data.page,
      method: "POST",
      success: res => {
        console.log(res)
        var that = this
        // 回调函数  
        var articles = that.data.articles;

        // 追加新数据
        // 格式化meta2数据
        // 暂时格式化作者数据
        // 格式化时间 mtime
        // 格式化标题 desc
        for (var i = 0; i < res.data.data.articles.length; i++) {
          res.data.data.articles[i].meta2 = JSON.parse(res.data.data.articles[i].meta2)
          res.data.data.articles[i].author = res.data.data.articles[i].author.substring(12, 17);
          res.data.data.articles[i].mtime = res.data.data.articles[i].mtime.substring(0, 10);
          if (res.data.data.articles[i].desc.length > 26) {
            res.data.data.articles[i].desc = res.data.data.articles[i].desc.substring(0, 26) + '...';
          }
          articles.push(res.data.data.articles[i]);
        }
        // 设置数据  
        that.setData({
          articles: that.data.articles
        })
        // 隐藏加载框  
        wx.hideLoading();
      },
      complete: res => {
        console.log(this.data.articles)




        //文章去重
        var hash = [];
        var articles = this.data.articles
        articles = articles.reduce(function (origin, aiticle) {
          hash[aiticle['id']] ? '' : hash[aiticle['id']] = true && origin.push(aiticle);
          return origin;
        }, []);
        console.log(articles)
        this.setData({
          articles: articles
        })

        



        //计算推荐文章因子
        articles.sort(function (a, b) {
          //  console.log(a[1])
          var resultA = a.meta2[0] + a.meta2[2] + a.meta2[3]
          var resultB = b.meta2[0] + b.meta2[2] + b.meta2[3]

          var parameter = 1;
          var timestamp = Date.parse(new Date())/1000;
          if((timestamp-a.meta2.org_ctime)<15*24*60*60){
            parameter = 0.7
          } else if ((timestamp - a.meta2.org_ctime) < 30 * 24 * 60 * 60){
            parameter = 0.5
          }else{
            parameter = 0.1
          }
          resultA = resultA*parameter;

          parameter = 1;
          if ((timestamp - b.meta2.org_ctime) < 15 * 24 * 60 * 60) {
            parameter = 0.7
          } else if ((timestamp - a.meta2.org_ctime) < 30 * 24 * 60 * 60) {
            parameter = 0.5
          } else {
            parameter = 0.1
          }
          resultB = resultB * parameter


          return resultB-resultA;
        });
        console.log(articles)
        this.setData({
          recommend: articles
        })

        // 如果文章数量不变，显示引导图
        if (this.data.articleNum == this.data.articles.length) {
          this.setData({
            touchBottom: true
          })
        }
        else {
          this.setData({
            articleNum: this.data.articles.length
          })
        }


      }
    })
  },

  // 展示每日一句模态框
  showModal() {
    this.setData({
      modalName: "Image"
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  // 监听导航在视图中位置
  onPageScroll: function(e) {
    let that = this;
    var query = wx.createSelectorQuery()
    query.select('.swiper-tab').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      if (res[0].top < 0) {
        that.setData({
          swiperTapTop: true
        })     
      }
      if (res[0].top > 0) {
        that.setData({
          swiperTapTop: false
        })
      }
    })
  },
  // 根据导航位置决定是否显示备用导航
  onShow: function() {
    this.onPageScroll()
  },




  // 关闭每日说浮动按钮
  hideEverydayTalkButton() {
    var that = this
    that.setData({
      everydayTalkButton: false
    })
    console.log("close button")
    console.log(that.data.everydayTalkButton)
  },

  // 获取每日图片和文字
  dailyInfo: function() {
    var textID = util.currentDay(new Date)
    console.log("每日推荐序号", textID)
    wx.request({
      url: domain + 'dailyrecommend/',
      method: 'GET',
      success: res => {
        var dailyText = res.data.data[textID].text.replace(/，/g, "\n").replace(/。/g, "\n\n").replace(/,/g, "\n").replace(/!/g, "\n").replace(/----/g, "\t---- ").replace(/;/g, "\n\n").replace(/；/g, "\n\n").replace(/:/g, "\n").replace(/：/g, "\n")
        var that = this
        that.setData({
          dailyText: dailyText,
          photo_url: res.data.data[textID].photo_url
        })
      }
    })
  },

  // 跳转至生成明信片页面——card
  toCard: function() {
    wx.reLaunch({
      url: '../card/card'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '发现'
    })
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    this.getPaper()
    this.getAudio()
    if (this.data.isFist) {
      this.showModal('Image')
    }
    this.dailyInfo()
    this.setData({
      isFist: false
    })
  },
})