// pages/navigation/navigation.js
const app = getApp()
const util = require('../../utils/util.js')
const domain = 'https://xinyuJiang.cn/psybot/'
const articleDomain = 'https://imgtext.psyhack.top'
Page({
  data: {
    background: [
      'https://xinyuJiang.cn/static/banner/banner1.jpg',
      'https://xinyuJiang.cn/static/banner/banner2.jpg',
      'https://xinyuJiang.cn/static/banner/banner3.jpg'
    ],
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

  /* version 2.1.7
  tokp: function (event) {
    var id = event.currentTarget.dataset.id
    console.log(id)
    var type = event.currentTarget.dataset.type
    var recommend = this.data.recommend
    var articles = this.data.articles
    if(type == 0)  //推荐文章
      wx.navigateTo({
         url: "kp-web/kp-web?src=" + recommend[id].src ,
       })
    else       //科普文章
      wx.navigateTo({   
        url: "kp-web/kp-web?src=" + articles[id].src ,
      })
  },
  */

  tokp: function(event) {
    var id = event.currentTarget.dataset.id
    console.log(id)
    var type = event.currentTarget.dataset.type
    var recommend = this.data.recommend
    var articles = this.data.articles
    if (type == 0) //推荐文章
      wx.navigateTo({
//        url: "kp-web/kp-web?src=" + recommend[id].link,
        url: "kp-web/kp-web?text=" + recommend[id].text,
      })
    else //科普文章
      wx.navigateTo({
//        url: "kp-web/kp-web?src=" + articles[id].link,
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
   * 文章获取 version 2.1.7
   */
  /*
  getPaper: function(){
    wx.request({
      url: domain + 'paper_list/',
      success:res=>{
        this.setData({
          articles:res.data.data
        })
      },
      complete:res=>{
        console.log(this.data.articles)
        //科普文章倒序
        var articles = this.data.articles
        const len = this.data.articles.length
        for (let j = 0; j < len / 2; ++j) {
          const t = articles[j]
          articles[j] = articles[len - 1 - j]
          articles[len - 1 - j] = t
        }
        this.setData({
          articles: articles
        })

      //乱序科普文章
        var recommend = articles
        const length = len
        for (let i = 0; i < length; ++i) {
          const x = Math.floor(Math.random() * length)
          const y = Math.floor(Math.random() * length)
          const temp = recommend[x]
          recommend[x] = recommend[y]
          recommend[y] = temp
        }
        this.setData({
          recommend: recommend
        })

      }
    })
  },
  */



  /**
   * 文章获取--图文（瀑布流）
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

        // 解码base64
        function base64_decode(input) { 
          var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
          var output = "";
          var chr1, chr2, chr3;
          var enc1, enc2, enc3, enc4;
          var i = 0;
          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
          while (i < input.length) {
            enc1 = base64EncodeChars.indexOf(input.charAt(i++));
            enc2 = base64EncodeChars.indexOf(input.charAt(i++));
            enc3 = base64EncodeChars.indexOf(input.charAt(i++));
            enc4 = base64EncodeChars.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
            }
          }
          return utf8_decode(output);
        }
        // 解码utf-8
        function utf8_decode(utftext) {  
          var string = '';
          let i = 0;
          let c = 0;
          let c1 = 0;
          let c2 = 0;
          while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
              string += String.fromCharCode(c);
              i++;
            } else if ((c > 191) && (c < 224)) {
              c1 = utftext.charCodeAt(i + 1);
              string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
              i += 2;
            } else {
              c1 = utftext.charCodeAt(i + 1);
              c2 = utftext.charCodeAt(i + 2);
              string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
              i += 3;
            }
          }
          return string;
        }


        // 格式化时间 mtime
        // 格式化标题 desc
        // 解码正文富文本 text
        var articles = this.data.articles
        const len = this.data.articles.length
        for (let i = 0; i < len; i++) {
          articles[i].mtime = articles[i].mtime.substring(0, 10);
          if (articles[i].desc.length>26){
            articles[i].desc = articles[i].desc.substring(0, 26) + '...';
          }
          articles[i].text = base64_decode(articles[i].text);
          console.log(articles[i].text);
          
        }


        //科普文章倒序
        var articles = this.data.articles
        for (let j = 0; j < len / 2; ++j) {
          const t = articles[j]
          articles[j] = articles[len - 1 - j]
          articles[len - 1 - j] = t
        }
        this.setData({
          articles: articles
        })

        //乱序推荐文章
        var recommend = articles
        const length = len
        for (let i = 0; i < length; ++i) {
          const x = Math.floor(Math.random() * length)
          const y = Math.floor(Math.random() * length)
          const temp = recommend[x]
          recommend[x] = recommend[y]
          recommend[y] = temp
        }
        this.setData({
          recommend: recommend
        })

      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '首页'
    })
    this.getPaper()
    this.getAudio()
  },

})