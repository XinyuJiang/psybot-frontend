

var audioManager = wx.getBackgroundAudioManager()
var playing = false
var areaWidth //播放进度滑块移动区域宽度
var viewWidth //播放进度滑块宽度
var lastTime //滑块移动间隔计算
const util = require('../../../utils/util.js')
const app = getApp()
const turingBotURL = 'http://openapi.tuling123.com/openapi/api/v2'
const domain = 'https://xinyuJiang.cn/psybot/'
const botURL = 'https://xinyuJiang.cn/static/img/bot-head.png'
Page({
  data: {
    message_list: [{
      myself: 0,
      head_img_url: botURL,
      'msg_type': 'text',
      'content': '😀我们来聊天吧~',
      create_time: util.formatTime(new Date()),
      showtime: true,
    },
    ],
    key: "f97196f24653449b952985dd9c4e7099", //图灵机器人秘钥
    scroll_height: wx.getSystemInfoSync().windowHeight - 54,
    page_index: 0,
    mode: true,
    cancel: false,
    status: 0,
    tips: ['按住 说话', '松开 结束', '取消 发送'],
    returnValue: '',
    state: {
      'normal': 0,
      'pressed': 1,
      'cancel': 2
    },
    toView: '',
    userInfo: {},
    hasUserInfo: false,
    openId: '',
    hasOpenId: false,
    isplay: false,
    audioChoice: -1,
    efficient: 5,
    showInput: true,
    isRight: false,
    i: 0,
    showNext: true,
    temp: '',
    userID: '',
    player: false,
    showbutton: false,
    currentminute: '',
    time: '',
    userreply: '',
    talkmode:'',
  },


  toChat:function(){
    wx.navigateBack({
    })
  },

  savereply: function (e) {
    this.setData({
      userreply: e.detail.value
    })
    console.log(this.data.userreply)
  },
  
  reply: function () {
    var that = this;
    console.log('显示reply内容', this.data.userreply)
    if (this.data.userreply) {
      var content = this.data.userreply;
      this.setData({
        userreply:'',
      })
    }
    else {
      var content = ''
    }

    if (content == '') {
      wx.showToast({
        icon: 'none',
        title: '总要写点什么吧'
      });
      return;
    }
    //this.check('6');
    var message_list = this.data.message_list;

    var message = {
      myself: 1,
      head_img_url: app.globalData.userInfo.avatarUrl,
      'msg_type': 'text',
      'content': content,
      create_time: util.formatTime(new Date())
    }
    message_list.push(message);
    that.store(message.content, 0);
    that.setData({ message_list: message_list })
    that.scrollToBottom()
    //let turingBotURL = "https://www.tuling123.com/openapi/api";
    let turingBotURL = "https://xinyujiang.cn/tulingapi/v2";
    console.log(content)
    wx.request({
      url: turingBotURL,
      method: 'post',
      data: {
        "perception": {
          "inputText": {
            "text": content
          }
        },
        "userInfo": {
          "apiKey": this.data.key,
          "userId":"demo"
        }
      },
      //封装返回数据格式
      header: {
        "Content-Type": 'json'
      },
      //请求成功的回调
      success: function (res) {
        var data = res.data;
        console.log(data)
        if (data.intent.code > 8008) {   
          //将返回值追加到列表
          var message = {
            myself: 0,
            head_img_url: botURL,
            'msg_type': 'text',
            'content': data.results[0].values.text,
            create_time: util.formatTime(new Date())
          }
          console.log(message)
          message_list.push(message)
          console.log('finish push')
          that.waitTitle()
          //调用set方法，告诉系统数据已经改变   启动循环，循环聊天信息
          that.setData({
            returnValue: data,
            // allContentList: that.data.allContentList,
            message_list: message_list,
            content: ''
          })
          that.showTitle()
          that.scrollToBottom()

        } else {
          console.log('Error')
        }
      }
    })

  },
  chooseImage: function () {
    // 选择图片供上传
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;

        tempFilePaths.forEach((tempFilePath) => {
          this.upload(tempFilePath, 'image');
        });
      }
    })
  },
  preview: function (e) {
    // 当前点击图片的地址
    var src = e.currentTarget.dataset.src;
    // 遍历出使用images
    var images = [];
    this.data.message_list.forEach(function (messasge) {
      if (messasge != null && messasge.msg_type == 'image') {
        images.push(messasge.content);
      }
    });
    // 预览图片
    wx.previewImage({
      urls: images,
      current: src
    });
  },
  switchMode: function () {
    // 切换语音与文本模式
    this.setData({
      mode: !this.data.mode
    });
  },
  touchStart: function (e) {
    // 触摸开始
    var that = this
    var startY = e.touches[0].clientY;
    wx.startRecord({
      success: function (res) {
        if (!that.data.cancel) {
          that.temp = res.tempFilePath,
            that.audioChoice = 0
          that.upload(res.tempFilePath, 'voice');
          console.log('语音保存成功', res.tempFilePath, that.audioChoice)
        }
      },
      fail: function (res) {
        console.log('tempFilePaths is ' + res.tempFilePaths);
        console.log('tempFilePath is ' + res.tempFilePath);
        console.log(res);
        //录音失败

      }
    })
    // 记录初始Y值
    that.setData({
      startY: startY,
      status: that.data.state.pressed
    });
  },
  touchMove: function (e) {
    // 触摸移动
    var movedY = e.touches[0].clientY;
    var distance = this.data.startY - movedY;
    this.setData({
      status: distance > 50 ? this.data.state.cancel : this.data.state.pressed
    });
  },
  touchEnd: function (e) {
    // 触摸结束
    var that = this
    var endY = e.changedTouches[0].clientY;
    var distance = that.data.startY - endY;
    
    // 距离超过50，取消发送
    this.setData({
      cancel: distance > 50 ? true : false,
      status: that.data.state.normal
    });
    // 不论如何，都结束录音
    wx.stopRecord();

  },
  upload: function (tempFilePath, type) {
    // 开始上传
    wx.showLoading({
      title: '发送中'
    });
    // 语音与图片通用上传方法
    var formData = {
      third_session: wx.getStorageSync('third_session'),
      mpid: this.data.mpid,
      fans_id: this.data.to_uid,
      msg_type: type,
    };
    var message_list = this.data.message_list;
    var message = {
      myself: 1,
      head_img_url: app.globalData.userInfo.avatarUrl,
      'msg_type': type,
      'content': tempFilePath,
      create_time: util.formatTime(new Date()),
      choice: 0
    };
    console.log(message.content, '+', message.choice)
    message_list.push(message);
    this.setData({
      message_list: message_list
    })
    this.scrollToBottom()
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
    rand = Math.ceil(Math.random() * 5);
    if (rand == 1) {
      this.makemessage(0, 'text', '我还看不懂这些呢，可不可以多教教我呢？')
    }
    else if (rand == 2) {
      this.makemessage(0, 'text', '我还在学习中！')
    }
    else if (rand == 3) {
      this.makemessage(0, 'text', '要不然换一个看看？')
    }
    else if (rand == 4) {
      this.makemessage(0, 'text', '不行不行，我看不懂……')
    }
    else {
      this.makemessage(0, 'text', '和我打字聊天吧~我还在学习中呢')
    }
  },

  scrollToBottom: function () {
    this.setData({
      toView: 'row_' + (this.data.message_list.length - 1)
    });
  },

  store: function (message, label) {
    console.log('存储信息', message)
    wx.request({
      url: domain + 'setspeech/',
      data: {
        user_id: this.data.userID,
        text: message,
        label: label
      },
      method: 'get',
      success: function (res) {
        console.log('setSpeech Complete', res.data.msg)
      }
    })

  },

  makemessage: function (mode, type, content, choice) {

    if (mode == 1) {
      for (var i = 0; i < 70000; i++);
      this.makemessage1(mode, type, content, choice);
    }
    else {
      wx.setNavigationBarTitle({
        title: '对方正在输入...'
      })
      for (var i = 0; i < 90000; i++);
      this.makemessage1(mode, type, content, choice);
      wx.setNavigationBarTitle({
        title: '闲聊模式'
      })
    }
  },

  makemessage1(mode, type, content, choice) {
    var that = this;
    var message_list = this.data.message_list;
    var source;
    var avaurl;
    if (mode == 1) {
      avaurl = app.globalData.userInfo.avatarUrl;
    }
    else {
      avaurl = botURL;
    }
    //判断是否显示时间
    this.setData({
      time: util.minutes(new Date()),
    })
    var show = false
    if (this.data.time != this.data.currentminute) {
      show = true
      this.data.currentminute = this.data.time
    }

    //判断消息类型
      var message = {
        myself: mode,
        head_img_url: avaurl,
        'msg_type': type,
        'content': content,
        create_time: util.formatTime(new Date()),
        showtime: show
      }
    message_list.push(message);

    that.setData({
      message_list: message_list,
      content: ''
    })
    that.scrollToBottom()
    
  },
  toFirstPage: function () {
    wx.reLaunch({
      url: '../first/first'
    })
  },
  
  waitTitle: function () {
    wx.setNavigationBarTitle({
      title: '对方正在输入...'
    })
    for (var i = 0; i < 5000000; i++); //等待时间
  },
  showTitle: function () {
    wx.setNavigationBarTitle({
      title: '闲聊模式'
    })
  },

  onLoad: function (options) {
    //y页面初始化时加载的原始数据
    // 设置标题
    wx.setNavigationBarTitle({
      title: '闲聊模式'
    })
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
        hasOpenId: true
      })
    }
    if (app.globalData.user_id) {
      this.setData({
        userID: app.globalData.user_id,
      })
    }
    else {
      console.log('进入chat时的openid', app.globalData.openId)
    }


    var talkmode
    if(options.talkmode == 0) talkmode = false
    else talkmode = true
    this.setData({
      talkmode:talkmode
    })

    
  },
})