
const loadGif = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553088752063&di=6281dc04e184cd76700e35864b94fef3&imgtype=0&src=http%3A%2F%2Fps.missyuan.com%2Fuploads%2Fallimg%2F130727%2F4-130HG422370-L.gif' //等待动效
var audioManager = wx.getBackgroundAudioManager()
var playing = false
var areaWidth //播放进度滑块移动区域宽度
var viewWidth //播放进度滑块宽度
var lastTime //滑块移动间隔计算
const belief_list = {
  '0': '非此即彼',
  '1': '以偏概全',
  '2': '心理过滤',
  '3': '否定正面思考',
  '4': '妄下结论',
  '5': '情绪化推理',
  '6': '罪责归己',
  '7': '低挫折容忍'
}
const util = require('../../../utils/util.js')
const app = getApp()
const domain = 'https://xinyuJiang.cn/psybot/'
const botURL = 'https://xinyuJiang.cn/static/img/bot-head.png'
const checkURL = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552196019147&di=45fb898534d9ff85930be8e5e51e81e9&imgtype=0&src=http%3A%2F%2Fs7.sinaimg.cn%2Fmw690%2F001SJEQfzy764OGvu3ca6%26690'
Page({
  data: {
    message_list: [
    {
      msg_id:0,
      myself: 0,
      head_img_url: botURL,
      'msg_type': 'text',
      'content':'😀你终于来了~',
      create_time: util.formatTime(new Date()),
      showtime: true,
      showbutton: true,
    },
    {
      msg_id: 1,
      myself: 0,// 0为bot，1为user
      head_img_url: botURL,
      'msg_type': 'text',//信息类型
      'content': '✊接下来我们可能会进行【基本测试】【心境检查】【信念挑战】【正念冥想】这几个环节，如果对环节内容不了解，可以点击左下方的【帮助】，了解环节内容以及Nafà的基本信息哦~',
      create_time: util.formatTime(new Date()),
      showtime: false,
      showbutton: true,
    },
      {
        msg_id: 2,
        myself: 0,// 0为bot，1为user
        head_img_url: botURL,
        'msg_type': 'text',//信息类型
        'content': '😊如果不需要Nafà为你进行心理疏导，点击右上方的【闲聊模式】，我们随便聊聊天哟~',
        create_time: util.formatTime(new Date()),
        showtime: false,
        showbutton: true,
      },
      {
        msg_id: 3,
        myself: 0,// 0为bot，1为user
        head_img_url: botURL,
        'msg_type': 'text',//信息类型
        'content': '🎈我们现在来做个小测试好吗？',
        create_time: util.formatTime(new Date()),
        showtime: false,
        showbutton: true,
      },
    {
      msg_id: 4,
      myself: 0,// 0为bot，1为user
      head_img_url: botURL,
      'msg_type': 'button1',//信息类型
      create_time: util.formatTime(new Date()),
      showtime: false,
      showbutton: true,
    },
    ],
    voice: {
      playing: false, //是否正在播放
      canPlay: false, //是否可以播放、加载完毕
      time: {}, //当前播放时间
      tip: "",
      margin: 0,
      title:'正念冥想',
      singer:'PsyHack',
      src:'',
      epname: '正念冥想',
    },
    key: "f97196f24653449b952985dd9c4e7099", //图灵机器人秘钥
    scroll_height: wx.getSystemInfoSync().windowHeight - 54,
    page_index: 0,
    mode: true,
    cancel: false,
    msg_id:4,
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
    audioChoice: -1,
    efficient: 5,
    corevalue: 2,  //默认2
    corevaluesum: 0,   //core10总分
    core: 1,      //题号
    showInput: false,
    doing: '测试',  //事件
    belief: [],
    belief_right: '',  //信念
    mind: '测试',  //思维
    contentA: '',
    contentB: '',
    contentM: '',
    isRight: false,
    i: 0,
    showNext: true,
    temp: '',
    mingxiang_start: '',
    mingxiang_end: '',
    mingxiang_res: '',
    mingxiang_type:'',
    disable: true,   //控制重复
    disable2:true,
    userID: '',
    player:false,   
    showbutton:false,
    currentminute: '',
    time:'',
    userreply:'',
    showtab:false,
  },

  tosmalltalk: function () {
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list,
    showtab:true })
 
    this.makemessage(1, 'text', '好呀~', 0);
      wx.navigateTo({
        url: '../smalltalk/smalltalk?talkmode=1',
      })
  },
  tosmalltalkdirect: function () {

    wx.navigateTo({
      url: '../smalltalk/smalltalk?talkmode=1',
    })
  },
  toreturn: function () {
    wx.navigateBack({
    })
  },

  scrollToBottom: function () {
    this.setData({
      toView: 'row_' + (this.data.message_list.length - 1)
    });
  },

  toshowtab:function(){
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })
    this.makemessage(1, 'text', '算了吧~', 1);
    this.makemessage(0, 'text', '好的，小主人。你还可以点击进行下面的按键来体验其他功能哟~', 1);
    this.setData({
      showtab: true
    })
  },
  mingxiang: function (e) {
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    var that = this
    console.log(e)
    console.log(e.currentTarget.dataset.text)
    var mingxiang_code = e.currentTarget.dataset.text;
    switch (mingxiang_code) {
      case '1':
        console.log('呼吸冥想')
        that.setData({ mingxiang_type: '呼吸冥想' })
        that.makemessage(1, 'text', '我要进行【呼吸冥想】', 1);
        that.makemessage(0, 'audio', '呼吸冥想', 1);
        break;
      case '2':
        console.log('晚间冥想')
        that.setData({ mingxiang_type: '晚间冥想' })
        that.makemessage(1, 'text', '我要进行【晚间冥想】', 1);
        that.makemessage(0, 'audio', '晚间冥想', 2);
        break;
      case '3':
        console.log('晨间冥想')
        that.setData({ mingxiang_type: '晨间冥想' })
        that.makemessage(1, 'text', '我要进行【晨间冥想】', 1);
        that.makemessage(0, 'audio', '晨间冥想', 3);
        break;
      case '4':
        console.log('行走冥想')
        that.setData({ mingxiang_type: '行走冥想' })
        that.makemessage(1, 'text', '我要进行【行走冥想】', 1);
        that.makemessage(0, 'audio', '行走冥想', 4);
        break;
      case '5':
        console.log('乘车冥想')
        that.setData({ mingxiang_type: '乘车冥想' })
        that.makemessage(1, 'text', '我要进行【乘车冥想】', 1);
        that.makemessage(0, 'audio', '乘车冥想', 5);
        break;
      case '6':
        console.log('正念减肥')
        that.setData({ mingxiang_type: '正念减肥' })
        that.makemessage(1, 'text', '我要进行【正念减肥】', 1);
        that.makemessage(0, 'audio', '正念减肥', 6);
        break;
      case '7':
        console.log('缓解焦虑')
        that.setData({ mingxiang_type: '缓解焦虑' })
        that.makemessage(1, 'text', '我要进行【缓解焦虑】', 1);
        that.makemessage(0, 'audio', '缓解焦虑', 7);
        break;
    }
    
    wx.hideTabBar({})
    that.audioChoice = mingxiang_code,
    that.makemessage(0, 'text', '点击【播放】键开始冥想。如果已完成，请点击下方按钮告诉我~')
    that.setData({
      showbutton: true,
      scroll_height: wx.getSystemInfoSync().windowHeight-54,
    })
    that.makemessage(1, 'end', '')
    var time =
      that.setData({
        mingxiang_start: util.backendTime(new Date()),
      })
  },

  toCore10: function () {
    this.setData({
      showtab:false,
    })
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    var name = this.data.userInfo.nickName
    this.setData({
      showInput: false
    })
    var corevalue = this.data.corevalue;  //单个题目选值
    if (this.data.core == 1) {
      this.makemessage(1, 'text', '那就做测试吧~', 0);
      this.makemessage(0, 'text', '🧐接下来会有10个句子，请根据你在过去一周内的情况选择答案,0表示从不，1表示偶尔，2表示有时，3表示经常，4表示总是。', 0);
      this.makemessage(0, 'text', '1.😐我感到紧张、焦虑或不安', 0);
      this.makemessage(1, 'core', '', 0);
      this.setData({
        core: this.data.core + 1,  //core 题号
      })
    }
    else if (this.data.core == 2) {
      console.log(corevalue + '  ' + this.data.corevaluesum);
      this.setData({
        corevaluesum: this.data.corevaluesum + corevalue  //+no.1
      })
      this.makemessage(1, 'text', '我的程度大概是' + corevalue, 0);
      this.makemessage(0, 'text', '2.🙂在需要的时候，我觉得可以找到人帮我', 0);
      this.makemessage(1, 'core', '', 0);
      this.setData({
        core: this.data.core + 1,
        corevalue: 2
      })
    }
    else if (this.data.core == 3) {
      console.log(corevalue + '  ' + this.data.corevaluesum);
      this.setData({
        corevaluesum: this.data.corevaluesum - corevalue  //-no.2  （反向计分）
      })
      this.makemessage(1, 'text', '我的程度大概是' + corevalue, 0);
      this.makemessage(0, 'text', '3.😊我觉得自己能够应付出现的问题', 0);
      this.makemessage(1, 'core', '', 0);
      this.setData({
        core: this.data.core + 1,
        corevalue: 2
      })
    }
    else if (this.data.core == 4) {
      console.log(corevalue + '  ' + this.data.corevaluesum);
      this.setData({
        corevaluesum: this.data.corevaluesum - corevalue  //-no.3（反向计分）
      })
      this.makemessage(1, 'text', '我的程度大概是' + corevalue, 0);
      this.makemessage(0, 'text', '4.🤐和别人讲话对我来说是一种负担', 0);
      this.makemessage(1, 'core', '', 0);
      this.setData({
        core: this.data.core + 1,
        corevalue: 2
      })
    }
    else if (this.data.core == 5) {
      console.log(corevalue + '  ' + this.data.corevaluesum);
      this.setData({
        corevaluesum: this.data.corevaluesum + corevalue  //+no.4
      })
      this.makemessage(1, 'text', '我的程度大概是' + corevalue, 0);
      this.makemessage(0, 'text', '5.😧我感到惊慌或恐惧', 0);
      this.makemessage(1, 'core', '', 0);
      this.setData({
        core: this.data.core + 1,
        corevalue: 2
      })
    }
    else if (this.data.core == 6) {
      console.log(corevalue + '  ' + this.data.corevaluesum);
      this.setData({
        corevaluesum: this.data.corevaluesum + corevalue  //+no.5
      })
      this.makemessage(1, 'text', '我的程度大概是' + corevalue, 0);
      this.makemessage(0, 'text', '6.😖我有过自杀计划', 0);
      this.makemessage(1, 'core', '', 0);
      this.setData({
        core: this.data.core + 1,
        corevalue: 2
      })
    }
    else if (this.data.core == 7) {
      console.log(corevalue + '  ' + this.data.corevaluesum);
      this.setData({
        corevaluesum: this.data.corevaluesum + corevalue  //+no.6
      })
      this.makemessage(1, 'text', '我的程度大概是' + corevalue, 0);
      this.makemessage(0, 'text', '7.😟我很难入睡或睡得不安稳', 0);
      this.makemessage(1, 'core', '', 0);
      this.setData({
        core: this.data.core + 1,
        corevalue: 2
      })
    }
    else if (this.data.core == 8) {
      console.log(corevalue + '  ' + this.data.corevaluesum);
      this.setData({
        corevaluesum: this.data.corevaluesum + corevalue  //+no.7
      })
      this.makemessage(1, 'text', '我的程度大概是' + corevalue, 0);
      this.makemessage(0, 'text', '8.😭我感到没有希望', 0);
      this.makemessage(1, 'core', '', 0);
      this.setData({
        core: this.data.core + 1,
        corevalue: 2
      })
    }
    else if (this.data.core == 9) {
      console.log(corevalue + '  ' + this.data.corevaluesum);
      this.setData({
        corevaluesum: this.data.corevaluesum + corevalue  //+no.8
      })
      this.makemessage(1, 'text', '我的程度大概是' + corevalue, 0);
      this.makemessage(0, 'text', '9.🙃我感到不开心', 0);
      this.makemessage(1, 'core', '', 0);
      this.setData({
        core: this.data.core + 1,
        corevalue: 2
      })
    }
    else if (this.data.core == 10) {
      console.log(corevalue + '  ' + this.data.corevaluesum);
      this.setData({
        corevaluesum: this.data.corevaluesum + corevalue  //+no.9
      })
      this.makemessage(1, 'text', '我的程度大概是' + corevalue, 0);
      this.makemessage(0, 'text', '10.😩一些不想要的画面或回忆让我感到痛苦', 0);
      this.makemessage(1, 'core', '', 0);
      this.setData({
        core: this.data.core + 1,
        corevalue: 2
      })
    }
    else {
      console.log(corevalue + '  ' + this.data.corevaluesum);
      this.setData({
        corevaluesum: this.data.corevaluesum + corevalue  //+no.10 
      })
      this.makemessage(1, 'text', '我的程度大概是' + corevalue, 0);
      this.makemessage(0, 'text', name + '，你这次的成绩是' + this.data.corevaluesum + '哦！', 0);
      var score = this.data.corevaluesum
      console.log(this.data.corevaluesum)

      this.setData({
        corevalue: 2,  //默认2
        corevaluesum: 0,   //core10总分
        core: 1      //题号
      })
      
      if (score >= 13) {
        this.makemessage(0, 'text', name + '可能需要考虑抑郁等心理困扰。')
        this.makemessage(0, 'text', '【信念挑战】可以有效帮助你缓解现在的情绪，快来试一下吧！', 0) 
        this.toCBT();
      }
      else if (score >= 8) {
        this.makemessage(0, 'text', name + '达到了【一般心理压力】的程度')
        this.makemessage(0, 'text', '😘别担心，下面进入【正念冥想】来缓解一下暂时的压力吧', 0)
        this.toACT();
      }
      else {
        this.makemessage(0, 'text', name + '👉最近的状态属于【健康】范围，养成习惯持续跟踪自己的情绪状态吧~')
        this.makemessage(0, 'text', '', 0)
        this.toJudgeKnowledge();
      }
      
      //存储测试数据
      wx.request({
        url: domain + 'settestgrade/',
        data: {
          user_id:this.data.userID,
          grade: score
        },
        method: 'get',
        success: res => {
          console.log('测试数据存储结果',res.data.msg)
        }
      })

    }
  },
  toStore2(e) {
    this.setData({ corevalue: e.detail.value })
    console.log(e)
  },

  toJudgeKnowledge:function(){
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    var name = this.data.userInfo.nickName
    this.makemessage(0, 'text', '😊'+name+',那我们一起来学习一些心理学知识好吗？', 0);
    this.makemessage(1, 'button2', '', 0);
  },
  toKnowledge:function(e){
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    var name = this.data.userInfo.nickName
    console.log(e.currentTarget.dataset.text)
    this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)
    console.log('判断科普')
    this.makemessage(0, 'kpurl', '', 0);
    this.makemessage(0, 'text', '😋'+name+'如果看完了科普文章，我们随便聊聊天吧！', 0);
    this.makemessage(1, 'button3', '', 0); //科普结束 闲聊入口
  },
  tokpurl:function(){
    wx.navigateTo({
      url: '../kpurl/kpurl',
    })
  },

  toTest: function () {
    this.setData({
      showInput: false
    })
    
    this.makemessage(0, 'text', '😜不知道你现在感觉怎么样了呢？', 0);
    this.makemessage(0, 'text', '🧐现在如果让你用0表示消极，9表示积极，你怎么选择？', 0);
    this.makemessage(1, 'check1', '如果用0-9表示现在的情绪状况，0表示非常消极，9表示非常积极，你会怎么选择呢？', 0);
  },
  toCBT: function () {
    this.setData({
      showInput: false
    })
    var name = this.data.userInfo.nickName
    this.makemessage(0, 'text', '【事件检测】 ' + name + '，告诉我你现在在做什么呢？', 0)
    this.makemessage(1, 'doing', '(在这里输入)', 0)
  },
  toACT: function () {
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    this.setData({
      showInput: false,
      disable2:true,
      showtab:false,
    })
    this.makemessage(1, 'text', '我想做冥想~', 0);
    this.makemessage(0, 'text', '第一次冥想练习，是你种下的第一颗种子🌱；每一次专注当下，种子慢慢长成一棵大树🍀；让冥想融入生活，让自己拥有整片森林🌳。', 0);
    this.makemessage(1, 'check2', '尝试冥想', 0);
  },
 
  confirmsmalltalk: function (e) {
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    console.log(e.currentTarget.dataset.text)
    this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)
    this.makemessage(0, 'text', '那我们进入闲聊模式吧~', 1);
    this.makemessage(1, 'ConfirmSmallTalk', '', 1);
  },

  toEnd: function () {
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    this.setData({
      showbutton:false,
      mingxiang_end: util.backendTime(new Date()),
    })
    audioManager.stop();
    this.setData({
      player: false,
    scroll_height: wx.getSystemInfoSync().windowHeight - 54,
    });
    this.makemessage(1, 'text', '💪我完成了！', 1)
    wx.showTabBar({})
    this.makemessage(0, 'text', '小主人，这次冥想后有什么感觉？和bot交流一下吧！', 0)
    this.makemessage(1, 'response', '(在这里输入)', 0)
  },
  toJudgeFinish: function () {
     
  },
  toSaveMingxiang:function(e){
    var that=this;
    if(this.data.disable2)
    {
      this.setData({
        mingxiang_res: e.detail.value
      })
      console.log('存储信息', this.data.mingxiang_res)
      this.makemessage(0, 'text', '原来是这样！我懂啦~', 0)
      console.log('存储正念冥想数据')
      wx.request({
        url: domain + 'setmingxiang/',
        data: {
          openid: that.data.openId,
          mingxiang_start: that.data.mingxiang_start,
          mingxiang_end: that.data.mingxiang_end,
          mingxiang_type: that.data.mingxiang_type,
          mingxiang_response: that.data.mingxiang_res,
        },
        method: 'get',
        success(res) {
          console.log('冥想数据存储结果:', res.data.msg)
          console.log('显示冥想类型：', that.data.mingxiang_type)
          console.log('显示冥想反馈：', that.data.mingxiang_res)
          console.log('显示冥想开始时间：', that.data.mingxiang_start)
          console.log('显示冥想结束时间：', that.data.mingxiang_end)
          console.log('冥想数据存储结果：', res.data.msg)
          that.makemessage(0, 'text', '下面小主人想做些什么？', 0)
          that.makemessage(0, 'button5', '', 0)
        }
      })
      this.setData({
        disable2: false
      })
    }
  },
  toReportmingxiang:function(){
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    var name = this.data.userInfo.nickName
    this.setData({
      disable2: true,
      player: false,
    })
    this.makemessage(1, 'text', '💪我想看一下自己的冥想统计报告~', 0)
    
      wx.request({
        url: domain + 'calcmingxiang/',    //调取冥想数据
        data: {
          user_id: this.data.userID   //此处应为openId
        },
        method: 'get',
        success: res =>  {
          console.log('获得冥想数据', res.data.msg)
          this.makemessage(0, 'text', '小主人，这是你的冥想报告')
          this.makemessage(0, 'image', res.data.data.url)
          this.makemessage(0, 'text', res.data.data.url)
          console.log(res.data.data.url)
          this.toJudgeKnowledge();

        }
      })
  },
  toStore(e) {
    
    console.log('change efficient to:',e.detail.value)
    this.setData({ efficient: e.detail.value })
  },
  toConfirm() {
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    var that = this
    var name = that.data.userInfo.nickName
    //console.log(that.data)
    var efficient = that.data.efficient
    console.log('efficient:',efficient)
    switch (efficient) {
      case 0:
        that.makemessage(1, 'text', '我的程度大概是' + efficient, 0);
        that.makemessage(0, 'text', '😭,' + name + '竟然觉得糟糕透了!', 0)
        break
      case 1: 
        that.makemessage(1, 'text', '我的程度大概是' + efficient, 0);
        that.makemessage(0, 'text', '😥，虽然没那么极端消极，但看起来' + name + '还是觉得非常糟糕!', 0)
        break
      case 2: 
        that.makemessage(1, 'text', '我的程度大概是' + efficient, 0);
        that.makemessage(0, 'text', '😟，虽然没那么消极，但看起来' + name + '还是觉得不太好!', 0)
        break
      case 3: 
        that.makemessage(1, 'text', '我的程度大概是' + efficient, 0);
        that.makemessage(0, 'text', '😕，还行还行，虽然' + name + '看来有点消极，但还没那么糟糕。', 0)
        break
      case 4: 
        that.makemessage(1, 'text', '我的程度大概是' + efficient, 0);
        that.makemessage(0, 'text', '🤔，一般般，看来现在' + name + '还算说得过去。', 0)
        break
      case 5: 
        that.makemessage(1, 'text', '我的程度大概是' + efficient, 0);
        that.makemessage(0, 'text', '😶，' + name + '现在不积极也不消极。', 0)
        break
      case 6: 
        that.makemessage(1, 'text', '我的程度大概是' + efficient, 0);
        that.makemessage(0, 'text', '😉,看来' + name + '心情还算不错~', 0)
        break
      case 7: 
        that.makemessage(1, 'text', '我的程度大概是' + efficient, 0);
        that.makemessage(0, 'text', '🤗，好像' + name + '有点开心噢~', 0)
        break
      case 8: 
        that.makemessage(1, 'text', '我的程度大概是' + efficient, 0);
        that.makemessage(0, 'text', '😀,' + name + ',最近好像有好事发生噢~', 0)
        break
      case 9: 
        that.makemessage(1, 'text', '我的程度大概是' + efficient, 0);
        that.makemessage(0, 'text', '😁，喜欢看到' + name + '开心的样子~', 0)
        break
    }
    console.log('存储信息', that.data)
    wx.request({
      url: domain + 'setemotion/',
      data: {
        openid: that.data.openId,
        efficient: that.data.efficient,
        awake: '0',
        belief: that.data.belief_right,
        activity: that.data.doing,
        mind: that.data.mind,
        ContentA: that.data.contentA,
        ContentB: that.data.contentB,
        ContentM: that.data.contentM
      },
      method: 'get',
      success: res =>{
        console.log('存储情绪信息', res.data.msg)
        this.toReport()
      }
    })
  },
  
  toClassify(e) {
    //console.log(e)
    var content = e.detail.value
    var that = this
    this.setData({ contentB: content })
    this.setData({ disable: true }) //关闭toDoing调用
    wx.request({
      url: domain + 'classifytext/',
      data: {
        text: content
      },
      method: 'GET',
      success(res) {
        console.log(res.data.data)
        var returnlist = res.data.data
        var belief = []
        for (var i = 0; i < 8; i++) {
          
          belief.push(belief_list[returnlist[i]])
        }
        that.setData({
          belief: belief
        })
        that.makemessage(0, 'text', '🤔以下是为您匹配到的可能的【错误信念】，由高到低排序，你觉得哪一个说得更像你呢？')
        that.makemessage(0, 'text', '【提示】如果不知道什么意思，直接点击第一条信念就可以啦~')
        that.makemessage(0, 'beliefcheck', '', 0)

      }
    })

  },
  toB: function (e) {
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    var that = this
    console.log(e.currentTarget.dataset.text)
    console.log(e._relatedInfo)
    that.setData({
      belief_right: e.currentTarget.dataset.text
    })
    var b = that.data.belief_right
    that.makemessage(1,'text','我觉得我像是陷入了【'+b+'】这个错误的信念中')
    that.makemessage(0, 'text', '知道什么是【' + b + '】嘛？')
    that.makemessage(1, 'b1', '', 0)
  },
  toB1: function (e) {
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })
    this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

    var that = this
    var b = that.data.belief_right

    console.log('选择中', b)
    switch (b) {
      case '非此即彼': that.makemessage(0, 'text', '【非此即彼】指在评价个人品质时，习惯于采用非黑即白的极端模式。', 0)
        break
      case '以偏概全': that.makemessage(0, 'text', '【以偏概全】指武断地认为一件事情如果在自己身上发生过，那么这件事会在自己身上一直发生。', 0)
        break
      case '心理过滤': that.makemessage(0, 'text', '【心理过滤】指从情景中只挑出消极事件，不经咀嚼，从而认为整个世界就是消极的。', 0)
        break
      case '否定正面思考': that.makemessage(0, 'text', '【否定正面思考】指固执将中性甚至正面的体验转化为负面体验。', 0)
        break
      case '妄下结论': that.makemessage(0, 'text', '【妄下定论】指不经过实际情况验证便迅速武断地得出负面结论。', 0)
        break
      case '情绪化推理': that.makemessage(0, 'text', '【情绪化推理】指把情绪状态当做是客观现实。', 0)
        break
      case '罪责归己': that.makemessage(0, 'text', '【罪责归己】指将负面事件的罪责归于自己。', 0)
        break
      case '低挫折容忍': that.makemessage(0, 'text', '【低挫折容忍】指在面对难以忍受的事情时就认为它“无法忍受”。', 0)
        break
    }
    that.makemessage(0, 'text', '需要我给你举个例子嘛？')
    that.makemessage(1, 'b2', '')
  },
  toB2: function (e) {
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    console.log(e.currentTarget.dataset.text)
    this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

    var that = this
    var b = that.data.belief_right
    console.log('选择中', b)
    switch (b) {
      case '非此即彼': that.makemessage(0, 'text', 'Bot有一个同事，他说话的时候喜欢用一些非常“绝对性”的词语来讲事情或描述一个人。今天早上的时候，他感到情绪低落，当他要开车上班室，汽车却怎么也发动不了，他一来就和我们抱怨道："这种事情总发生在我身上，事事都不顺，我怎么总这么点背？" 平时的时候他也非常易怒，一次当他要乘车去看望朋友，可前面买票的乘客因为找不到钱，耽误了他买票的时间。他暗自说道："真是绝了！其他人都这么回事，这么也都是这么笨。"然后他反倒变得更焦急、更生气了。这样的情况在你身上发生过吗？', 0)
        break
      case '以偏概全': that.makemessage(0, 'text', '看到一只羊是黑色就以为全世界的羊都是黑色，遇见一个错的人就以为全世界的人都是坏的，因为一时疏忽在工作上做错了一件事便断定自己的事业失败了，这种看到一点点片面的现象就无限扩大范围到整个过程，我说的是不是你呢？', 0)
        break
      case '心理过滤': that.makemessage(0, 'text', 'Bot的妹妹最近参加了一次面试，这是她第一次应聘播音员。节目制作人告诉塔，说她表现得相当好;而且还说，这是她初次参加此类面试，说明她更加出色。然而Bot的妹妹并没有对正面的反馈感到高兴，而是觉得那是一种挖苦。在她的脑海中，节目制作人的评价围绕着她的缺乏经验，意味着她根本就不出色。由于她选择性地关注制作人所说的“初次面试”，而忽略了其他反馈，太把别人的评价理解为批评而非赞赏，本来值得开心的事情突然变得一片漆黑，类似情况在你身上发生过吗？', 0)
        break
      case '否定正面思考': that.makemessage(0, 'text', '你拒绝正面的体验，坚持以这样或那样的理由说“这样不算”，虽然这样的消极信念有悖于客观现实，但你却以这种方式固执地坚持，我说的对吗？', 0)
        break
      case '妄下结论': that.makemessage(0, 'text', '你习惯用消极的理解方式下结论，即使没有确切的事实有力地证明也如此。听说过“读心术”现象吗？如果发现他人的行为不尽如人意，你就认为这些事这些人就是在针对你，这种情况在你身上出现过吗？', 0)
        break
      case '情绪化推理': that.makemessage(0, 'text', '你认为，只要有负面情绪出现就说明整件事情糟糕透了，甚至失败了，因为你认为“我感觉到了，那就是对的”。你可能会总有“不祥的预感”，你会“害怕，有人可能在害我”，你会“紧张，肯定哪里不对劲”，我说的是你吗？', 0)
        break
      case '罪责归己': that.makemessage(0, 'text', '一旦出错就是我的问题，你必须很努力去取悦别人，讨好别人，你总是给自己定下一个又一个的要求，你总是逼自己完成一个又一个不切实际的目标，你在社交场合感到焦虑不安，因为你觉得你必须得到每个人的认可……种种这一些里有你的影子吗？', 0)
        break
      case '低挫折容忍': that.makemessage(0, 'text', '也就是说，当为了长远利益需要忍受暂时的痛苦的时候，人们会放大痛苦或拒绝接受这些痛苦。比如赶到ddl才完成的作业和任务，在有时间的时候总告诉自己现在心情不好或不在状态，一拖再拖，直到火烧眉毛的时候才草草收场。我说的是你吗？', 0)
        break
    }
    that.makemessage(1, 'b3', '')
  },

  toBRe: function (e) {
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    console.log(e.currentTarget.dataset.text)
    this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)
    this.makemessage(0, 'text', 'Bot学习到了，那么按顺序点击下一个可能的信念吧~')
    this.makemessage(0, 'beliefcheck', '', 0)
  },


  toBEnd: function (e) {
    var message_list = this.data.message_list;
    var length = message_list.length;
    message_list[length - 1].showbutton = false
    this.setData({ message_list: message_list })

    var that = this
    var b = that.data.belief_right
    console.log(e.currentTarget.dataset.text)
    that.makemessage(1, 'text', e.currentTarget.dataset.text, 0)
    console.log('选择中', b)
    switch (b) {
      case '非此即彼': that.makemessage(0, 'text', '世界没有绝对的非黑即白的事情，尝试着把你之前说的那件事出现“绝对性”词汇的地方替换过来，写下来告诉我吧！', 0)
        break
      case '以偏概全': that.makemessage(0, 'text', '你觉得这种想法必然导致这种结果吗？如果不是，尝试把这种想法细化一下，不去这么片面地看待这个问题，把你现在的这个想法修改一下告诉我可以吗？', 0)
        break
      case '心理过滤': that.makemessage(0, 'text', '那么，想想支持你这种想法的证据在哪里呢？这个证据真的可靠吗？如果没有，可不可以尝试着把你刚才这个想法重新修改一下呢？', 0)
        break
      case '否定正面思考': that.makemessage(0, 'text', '正面的积极思考呢？事情的好一面难道不是你努力的结果吗？可不可以把这件事情好的一面和你的付出联系在一起呢？写下来告诉我吧！', 0)
        break
      case '妄下结论': that.makemessage(0, 'text', '那么，想想支持你这种想法的证据在哪里呢？这个证据真的可靠吗？如果没有，说明你现在的想法实际上并没有太大可信度的呀！那么，可不可以尝试着把你刚才这个想法重新修改一下呢？', 0)
        break
      case '情绪化推理': that.makemessage(0, 'text', '你有没有过这种体验？同一件事情在不同情绪体验下会有不同的想法呢？先不要着急下定论，可不可以重新评估一下现在所经历的事情呢？假装你站在第三人称的角度重新看这件事情，可不可以把你现在的感受重新写一下给我看呢？', 0)
        break
      case '罪责归己': that.makemessage(0, 'text', '难道这些都是你自己的错吗？为什么要把所有的事情交给你一个人承担呢？有这样的证据支持你的想法吗？如果没有，可不可以尝试把刚才的说法修改修改呢？写下来告诉我吧！', 0)
        break
      case '低挫折容忍': that.makemessage(0, 'text', '告诉自己无法忍受痛苦只会让自己更关注所经历的痛苦，同时不断低估自己的痛苦承受能力。很多事情可能难以忍受，但如果你认为他们“无法忍受”，只会使事情更加可怕，尽管实际上他们其实并没有这么吓人，不是吗？试着给自己暗示，强调自己忍受痛苦的能力，强迫自己去做这些痛苦或不愉快的事情。现在，把你的改变写下来告诉我，我们一起努力，可以吗？', 0)
        break
    }


    that.makemessage(1, 'rewrite', '(在这里输入)', 0)
  },
  toAll: function (e) {
    var that = this
    var text = e.detail.value
    that.setData({ contentM: e.detail.value }) //contentM存储
    wx.request({
      url: domain + 'biclassifyemotion/',
      data: {
        text: text
      },
      method: 'get',
      success(res) {
        console.log('分类结果', res.data.data)
        var result = res.data.data
        if (result == 1) {
          that.makemessage(0, 'text', '👏太棒了', 0)
          that.setData({
            mind: '积极'
          })
        }
        else {
          that.makemessage(0, 'text', '😕好像没有改过来呢', 0)
          that.makemessage(0, 'text', '😊不过没关系，再多试几次，一定会有效果的~', 0)
          that.setData({
            mind: '消极'
          })
        }
        that.toTest();
      }
    })
  },

  toDoing: function (e) {
    var doing = e.detail.value
    if (this.data.disable) { //判断是否为第一次调用
      console.log(doing)
      //if(doing=='(在这里输入)')
      this.setData({ contentA: doing })
      
      this.makemessage(0, 'text', '😏原来如此', 0)
      this.makemessage(0, 'text', '【自动化思维检测】那么你在做这件事情的时候在想什么呢？', 0)
      this.makemessage(1, 'classify', '(在这里输入)', 0)
      this.setData({ disable: false })  //关闭调用
    }

    this.setData({
      showInput: false
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
        title: '疏导模式'
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
      time : util.minutes(new Date()),
    })
    var show = false
    if (this.data.time != this.data.currentminute){ 
      show = true
      this.data.currentminute = this.data.time
    }


    //判断消息类型
    if (type == 'audio') { 
      audioManager.stop()
      if (choice == 1) source = 'https://xinyujiang.cn/static/mingxiang/1.mp3';
      else if (choice == 2) source = 'https://xinyujiang.cn/static/mingxiang/2.mp3';
      else if (choice == 3) source = 'https://xinyujiang.cn/static/mingxiang/3.mp3';
      else if (choice == 4) source = 'https://xinyujiang.cn/static/mingxiang/4.mp3';
      else if (choice == 5) source = 'https://xinyujiang.cn/static/mingxiang/5.mp3';
      else if (choice == 6) source = 'https://xinyujiang.cn/static/mingxiang/6.mp3';
      else if (choice == 7) source = 'https://xinyujiang.cn/static/mingxiang/7.mp3';

      this.data.voice.title = content;
      this.data.voice.src = source;

      this.setData({
        player: true
      });
      this.setData({
        voice: this.data.voice
      })

    }
    else {
      var msg_id = this.data.msg_id - 1 + 2
      this.setData({ msg_id: msg_id })
      var message = {
        msg_id: msg_id,
        myself: mode,
        head_img_url: avaurl,
        'msg_type': type,
        'content': content,
        create_time: util.formatTime(new Date()),
        showtime: show,
        showbutton:true,
      }
      message_list.push(message);
    }
    that.setData({
      message_list: message_list,
      content: ''
    })
    that.scrollToBottom()
  },
  toFirstPage: function () {
    wx.navigateTo({
      url: '../first/first'
    })
  },
  toReport: function () {
    var that = this

    wx.request({
      
      url: domain + 'getuserid/',
      data: {
        openid: this.data.openId
      },
      method: 'get',
      success: function (res) {
        that.setData({ userID: res.data.data })
        wx.request({
          url: domain + 'user_stat/',
          data: {
            user_id: that.data.userID 
          },
          method: 'get',
          success: function (res) {
            console.log('显示userid：',that.data.userID )
            that.makemessage(0, 'text', '小主人，这是你近五天的情绪报告')
            let tempFilePath = canvas.toTempFilePathSync({
              x: 10,
              y: 10,
              width: 200,
              height: 150,
              destWidth: 400,
              destHeight: 300
            })
            that.makemessage(0, 'image', tempFilePath)
            console.log(res.data.data.url)
            that.makemessage(0, 'text', '😝相信小主人在我的陪伴下情绪会有所改善~ ')
            that.makemessage(0, 'text', '下一步我们做些什么好的呢？')
            that.makemessage(0, 'button4', '')
          }
        })
      }
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
      title: '疏导模式'
    })
  },

  onLoad: function () {
    //y页面初始化时加载的原始数据
    // 设置标题
    wx.setNavigationBarTitle({
      title: '疏导模式'
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    if (app.globalData.user_id) {
      this.setData({
        userID: app.globalData.user_id,
      })
    }
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
        hasOpenId: true
      })
    }
    else {
      console.log('进入chat时的openid',app.globalData.openId)
      console.log('Miss OpenId', app.globalData)
    }

/////////////////////////////// 冥 想 音 乐 播 放 部 分 //////////////////////////////////////////
    var that = this
    //第一次进来应该获取节点信息，用来计算滑块长度
    if (areaWidth == undefined || areaWidth == null || viewWidth == undefined || viewWidth == null) {
      var query = wx.createSelectorQuery()
      setTimeout(function () { //代码多的情况下需要延时执行，否则可能获取不到节点信息
        //获取movable的宽度，计算改变进度使用
        query.select('#movable-area').boundingClientRect(function (rect) {
          areaWidth = rect.width
          console.log("areaWidth------->", areaWidth)
        }).exec();
        query.select('#movable-view').boundingClientRect(function (rect) {
          viewWidth = rect.width // 节点的宽度
          console.log("viewWidth------->", viewWidth)
        }).exec()
      }, 2000)
    }

    audioManager = wx.getBackgroundAudioManager()
    //播放
    // audioManager.obeyMuteSwitch = false
    audioManager.onPlay(() => {
      console.log('onPlay')
      playing = true
      that.data.voice.tip = "Playing"
      that.data.voice.playing = true
      that.data.voice.canPlay = true //加载完成后可以
      that.setData({
        voice: that.data.voice
      })
    })
    audioManager.onStop(() => {
      console.log('onStop')
      playing = false
      that.data.voice.tip = "Stop"
      that.data.voice.playing = false

      that.setData({
        voice: that.data.voice
      })
    })
    audioManager.onPause(() => {
      console.log('Pause')
      playing = false
      that.data.voice.tip = "Pause"
      that.data.voice.playing = false
      that.setData({
        voice: that.data.voice
      })
    })
    audioManager.onWaiting(() => {
      console.log('Pause')
      playing = false
      that.data.voice.tip = "Pause"
      that.data.voice.playing = false
      that.setData({
        voice: that.data.voice
      })
    })
    //播放进度
    audioManager.onTimeUpdate(() => {
      that.data.voice.progress = Math.round(100 * audioManager.currentTime / audioManager.duration)
      that.data.voice.time = dateformat(Math.round(audioManager.currentTime))
      that.data.voice.margin = Math.round((areaWidth - viewWidth) * (audioManager.currentTime / audioManager.duration)) //计算当前滑块margin-left
      console.log('进度', audioManager.currentTime + "  " + audioManager.duration)
      that.setData({
        voice: that.data.voice
      })
    })
    //播放结束
    audioManager.onEnded(() => {
      console.log("onEnded")
      playing = false
      that.data.voice.progress = 100
      that.data.voice.tip = "End Playing"
      that.data.voice.playing = false
      that.data.voice.time = dateformat(Math.round(audioManager.duration))
      that.data.voice.margin = Math.round(areaWidth - viewWidth)
      that.setData({
        voice: that.data.voice
      })

    })
    //播放错误
    audioManager.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      playing = false
      that.data.voice.tip = "Error Playing"
      that.data.voice.playing = false
      that.setData({
        voice: that.data.voice
      })
      wx.showToast({
        title: '错误:' + res.errMsg,
        icon: "none"
      })
    })
},

  //移动结束再setData，否则真机上会产生 “延迟重放” 
  seekTouchEnd: function (e) {
    var that = this
    setTimeout(function () {
      that.setData({
        voice: that.data.voice
      })
      audioManager.seek(audioManager.duration * (that.data.voice.progress / 100))
      audioManager.play()
    }, 300)
  },
  //移动音频滑块，此处不能设置moveable-view 的x值，会有冲突延迟
  voiceSeekMove: function (e) {
    var that = this
    if (e.detail.source == "touch") {
      audioManager.pause()
      console.log(e)
      if (that.data.voice.canPlay) {
        var progress = Math.round(e.detail.x / (areaWidth - viewWidth) * 100)
        that.data.voice.progress = progress
        that.data.voice.margin = e.detail.x
        that.data.voice.time = dateformat(Math.round(audioManager.duration * (that.data.voice.progress / 100)))
      }
    }
  },

//点击播放、暂停
voiceClick: function () {
  var playing2 = this.data.voice.playing
  if (playing2) {
    audioManager.pause()
    this.setData({
      mingxiang_end: util.backendTime(new Date()),
    })
  } else {
    audioManager.title = this.data.voice.title;
    audioManager.epname = '正念冥想';
    audioManager.singer = 'PsyHack';
    audioManager.coverImgUrl = 'https://laurenfitzxo.files.wordpress.com/2017/10/cropped-da64c7f3b6da085631701bcb2ed5cd51-iphone-backgrounds-tumblr-mobile-backgrounds.jpg'
    audioManager.src = this.data.voice.src;
    audioManager.play()
  }
},

})

function dateformat(second) {
  //天
  var day = Math.floor(second / (3600 * 24))
  // 小时位
  var hour = Math.floor((second - day * 3600 * 24) / 3600);
  // 分钟位
  var min = Math.floor((second - day * 3600 * 24 - hour * 3600) / 60);
  // 秒位
  var sec = (second - day * 3600 * 24 - hour * 3600 - min * 60); // equal to => var sec = second % 60;

  return {
    'day': day,
    'hour': p(hour),
    'min': p(min),
    'sec': p(sec)
  }
}
//创建补0函数
function p(s) {
  return s < 10 ? '0' + s : s;
}