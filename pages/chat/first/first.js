
const util = require('../../../utils/util.js')
const app = getApp()
const domain = 'https://xinyuJiang.cn/psybot/'
const botURL = 'http://bpic.588ku.com/element_origin_min_pic/17/12/17/20b214d22624a6e6d60b017049a90956.jpg!/fwfh/804x932/quality/90/unsharp/true/compress/true'
const checkURL = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552196019147&di=45fb898534d9ff85930be8e5e51e81e9&imgtype=0&src=http%3A%2F%2Fs7.sinaimg.cn%2Fmw690%2F001SJEQfzy764OGvu3ca6%26690'
Page({
  data: {
    message_list: [{
        myself: 0,
        head_img_url: botURL,
        'msg_type': 'text',
        'content': '💗欢迎~这里是Bot的使用帮助手册~',
        create_time: util.formatTime(new Date()),
        showtime: true,
        showbutton: true,
      },

      {
        myself: 0,
        head_img_url: botURL,
        'msg_type': 'text',
        'content': '😊以下是大家通常问我的一些问题。',
        create_time: util.formatTime(new Date()),
        showtime: false,
        showbutton: true,
      },
      {
        myself: 0,
        head_img_url: botURL,
        'msg_type': 'button',
        'choice2': '正念冥想是什么？',
        'choice3': '还能和你聊天？',
        'choice1': '你是怎么进行疏导的呢？',
        'choice5': '你是谁？',
         create_time: util.formatTime(new Date()),
         showtime: false,
         showbutton: true,
      },
    ],
    scroll_height: wx.getSystemInfoSync().windowHeight - 30,
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
    openId:{},
    hasOpenId: false,
    isplay: false,
    audioChoice:-1,
    efficient:5,
    showInput:false,
    doing:'',
    belief:[],
    belief_right:'',
    isRight:false,
    i:0,
    showNext:true,
    temp:'',
    disable:true,
    currentminute: '',
    time: '',
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
mingxiang:function(e){
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  var that = this
  console.log(e.currentTarget.dataset.code)
  var mingxiang_code = e.currentTarget.dataset.code
      switch(mingxiang_code)
      {
        case '1':
          console.log('呼吸冥想')
          that.makemessage(0, 'text', '🤗呼吸练习是最基本的冥想练习，希望帮助通过调节呼吸的方式帮助你进行放松。 ',1);
          break;
        case '2':
          console.log('晚间冥想')
          that.makemessage(0, 'text', '💤晚间冥想是适用于夜间进行的冥想练习，希望陪伴你在入睡前进行放松。',2);
          break;
        case '3':
          console.log('晨间冥想')
          that.makemessage(0, 'text', '🌞晨间冥想是清晨进行的冥想练习，适用于起床后工作前，帮助你提高注意力。',3);
          break;
        case '4':
          console.log('行走冥想')
          that.makemessage(0, 'text', '🚶‍行走冥想是日常步行过程中进行的冥想练习，适用于出行时的碎片时间训练。',4);
          break;
        case '5':
          console.log('乘车冥想')
          that.makemessage(0, 'text', '🚗乘车冥想适用于你在乘车时进行的冥想练习，合理利用碎片时间进行冥想训练。',5);
          break;
        case '6':
          console.log('正念减肥')
          that.makemessage(0, 'text', '🙌正念减肥及其适用于减肥用户，用于缓解食欲。（可以帮你管住嘴但还需要你迈开腿噢~）',6);
          break;
        case '7':
          console.log('缓解焦虑')
          that.makemessage(0, 'text', '😌缓解焦虑冥想训练适用于你在焦虑时使用，紧急情况发生时强烈建议进行这一训练噢。',7);
          break;
      }
      that.audioChoice = mingxiang_code,
      
      that.makemessage(1,'end','')

},

toCBT: function(e){
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  var name = this.data.userInfo.nickName
  this.makemessage(0, 'text','我会通过【认知行为疗法】进行干预和疏导。',0)
  this.makemessage(0,'text','认知行为治疗(Cognitive-Behavioral Therapy，CBT)是一大类包括了认知治疗和行为治疗的心理治疗方法，是通过改变个人非适应性的思维和行为模式来减少失调情绪和行为，以改善心理问题的一系列心理治疗方法的总和。',0)
  this.makemessage(1,'CBT1','(在这里输入)',0)
  this.setData({
    showInput:false
  })
},

toACT: function(e){
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  this.makemessage(0, 'text', '像各种健身方式一样，冥想是一种锻炼大脑的工具。',0);
  this.makemessage(0, 'text', '从苹果公司创始人乔布斯,到现在金融圈很火的桥水基金创始人达里奥,他们都是冥想的真爱粉。', 0);
  //this.makemessage(1, 'check2', '尝试冥想',0);
  this.makemessage(1,'ACT1','继续讲讲'); 
  this.setData({
    showInput: false
  })
},
toACT1:function(e){
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  this.makemessage(0,'text','😊以下是现阶段提供的冥想训练，请问你想继续了解哪一个呢？',0)
  this.makemessage(1, 'check2', '尝试冥想', 0);
  this.setData({
    showInput: false
  })
},

toChat: function (e) {
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  this.setData({
    showInput: false
  })
   this.makemessage(0, 'text', '😘对的！直接在文本框输入并点击键盘上的发送，就可以和我聊天啦！',1);
   this.makemessage(0, 'text', '😭但是我有时候可能误会小主人的意思，说一些乱七八糟的话，还希望小主人多多理解!', 1);
   this.makemessage(1,'showInput','知道了~',1)
},
toShowInput:function(){
  this.setData({
  showInput: true
  })
},
toEnd: function(e){
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  this.makemessage(0, 'text','💪每天仅需要几分钟的时间进行冥想训练，即可以使我们从忙碌的生活中理出头绪，通过科学的方法进行减压，要坚持噢。',0)
  this.makemessage(0, 'text','接下来想做了解些什么呢？',0)
  this.makemessage(1,'button','',0)
},
toStore(e){
  //console.log(e.detail.value)
  this.setData({efficient: e.detail.value})
},
toAsk(e){
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  var that = this
  var name = that.data.userInfo.nickName
  this.makemessage(0, 'text', '那'+name+'接下来想做些什么呢？', 0);
  this.makemessage(1, 'help2', '', 0)
},

/**
 * Bot自我介绍入口
 */
toIntro: function (e) {
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  this.makemessage(0, 'text', '😮我是你的私人人工智能心理健康助手Nafà，蕴含了众多心理学家和咨询师的理论知识和实践经验，并且由优秀的计算机科学家和数据科学家共同开发，专为用户提供心理健康服务。',0)
  this.makemessage(1, 'intro1', '', 0)  //这么厉害？
  this.setData({
    showInput:false
  })
},
//节点1
toIntro1:function(e){
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  var message_list = this.data.message_list;
  this.makemessage(0,'text','😊当然~',0)
  this.makemessage(0, 'text', '与线下的咨询师不同，我拥有无数聪明的大脑，而且将为您提供 24 小时全天候的个性化服务，一旦你需要帮助就可以直接点开小程序找到我，我一直在你身边💖', 0)
  
//用户支路信息入口
  this.makemessage(1, 'intro2', '', 0)
  this.setData({
    showInput:false
  })
  this.scrollToBottom()
},

//节点2
toIntro2:function(e){
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  this.makemessage(1,'text', '好棒！很高兴认识你！',0)
  this.makemessage(0,'text','还想知道什么？',0)
  this.makemessage(0, 'button','',0)
},

//节点3
toIntro3: function (e) {
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  this.makemessage(1, 'text', '可我又没有病，需要你干什么？', 0)
  var image = 'https://tse1.mm.bing.net/th?id=OIP.p3ko3blrvbjZ-hf8S324uwHaNn&pid=Api&dpr=1'
  this.makemessage(0,'image',image,0)
  this.makemessage(0, 'text', '🤔先别着急~虽然你知道你没有什么病，但你难免会在生活中遇到这样那样的【意外】使【身体】受【伤】,这倒是没错吧~',0)
  this.makemessage(1,'intro3-1','')
},
toIntro3_1: function(e){
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  var image = 'http://img.juimg.com/tuku/yulantu/140208/330792-14020P0351861.jpg'
  this.makemessage(0, 'image', image, 0)
  this.makemessage(0, 'text', '🤕有些【伤】的影响不大，通过身体本身的调节能力就能恢复; 但有些【伤】恢复起来并没有那么容易，这时候你会知道向医生或其他专家寻求帮助，借用他们的知识经验或其他技术手段使自己恢复健康。',0)
  this.makemessage(1, 'intro3-2','那是当然了。')
},
toIntro3_2: function (e) {
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  var image = 'https://tse4.mm.bing.net/th?id=OIP.QaoVgzYN589AadIo1JdFLwHaLi&pid=Api&dpr=1'
  this.makemessage(0, 'image', image, 0)
  this.makemessage(0, 'text', '😊嗯~ 而且即使在没有【病】的时候，你还会通过各种有氧或无氧等锻炼使身体，使自己拥有更强健的体魄，更加适应这个世界，我说得对不对?', 0)
  this.makemessage(1, 'intro3-3', '',0)
},
toIntro3_3: function (e) {
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  var message_list = this.data.message_list;
  var image = 'http://xlzx.c.ynwin.com/uploadfile/image/20160523/20160523110255655565.png'
  this.makemessage(0, 'image', image, 0) //图片
  this.makemessage(0, 'text', '其实对于心理健康也是一个道理——虽然你可能认为自己没有什么”病”，但日常生活中总会接触到无数这样或那样的【事件】，比如升学、离乡、恋爱、升迁，甚至家庭变故等等，这些事件经由大脑进行【加工】，从而产生了你对这些事件的【思维】，从而控制你的身体产生各式各样的【行为】。', 0) //
  
  //用户支路信息入口
  this.makemessage(1, 'intro3-choice', '', 0) //
  this.setData({
    showInput: false,
  })
  this.scrollToBottom()

},
toIntro3_4: function (e) {
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  this.makemessage(0, 'text', '偷偷拿我老大身上发生的事情和你讲🤫答应我不要和我老大告状噢', 0)
  this.makemessage(1, 'intro3-5', '', 0)
},
toIntro3_5: function (e) {
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  var image = 'https://tse1.mm.bing.net/th?id=OIP.fD2MQO3MVInLtJSvAXEVZAAAAA&pid=Api&dpr=1' //焦虑词云图
  this.makemessage(0, 'image', image, 0)
  this.makemessage(0, 'text', '老大大学期间如愿【换了专业】，本身应该是一件非常值得开心的事情，但这段时间老大一直闷闷不乐的，整天一副天要塌下来的样子【愁东愁西】：每天把自己的日程排得满满的，到了晚上就疯狂刷手机，一直【失眠焦虑】，成天打不起精神来。', 0)
  this.makemessage(0, 'text', '一天老大和朋友们出门吃饭，朋友【玩笑】地问了一句：“你这一转过去相当于完全重新开始，大龄剩女准备什么时候才毕业啊？”不料，这一句话像是触动了老大的泪腺开关，突然在大庭广众之下【止不住哭了起来】。', 0)
  this.makemessage(1, 'intro3-6', '', 0)
},
toIntro3_6: function (e) {
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  var image = 'https://tse1.mm.bing.net/th?id=OIP.G9oaPc4UEr9KtbPSZvNBBQHaFj&pid=Api&dpr=1' //认知模型举例
  this.makemessage(0, 'image', image, 0)
  this.makemessage(0, 'text', '正如图片所示，换专业中的挫折与不确定性带给老大极大的压力，这一【事件】经由她的大脑加工转化成了她的【信念】，让她觉得自己是没有价值的；而这一核心信念生成了她的【自动思维】，经由同学玩笑的【情景刺激】，使她疯狂质疑自己，认为自己不如别人，从而生成了后续一系列的【行为反应】。', 0)
  this.makemessage(1, 'intro3-7', '', 0)
},
toIntro3_end: function (e) {
  var message_list = this.data.message_list;
  var length = message_list.length;
  message_list[length - 1].showbutton = false
  this.setData({ message_list: message_list })
  this.makemessage(1, 'text', e.currentTarget.dataset.text, 0)

  this.makemessage(0,'text','这就是我该上场的时候啦~我这里会提供这三种辅助方法，想继续了解哪一个？')
  this.makemessage(0, 'button', '', 0)
},

  /**
   * 关键函数，创造对话交互的信息
   */
  makemessage: function (mode, type, content, choice) {

    if (mode == 1) {
      for (var i = 0; i < 700; i++);
      this.makemessage1(mode, type, content, choice);
    }
    else {
      wx.setNavigationBarTitle({
        title: '对方正在输入...'
      })
    
      for (var i = 0; i < 900; i++);
      this.makemessage1(mode, type, content, choice);
      wx.setNavigationBarTitle({
        title: '帮助手册'
      })
    }
  },

makemessage1(mode,type,content,choice){
  var that = this;
  var message_list = this.data.message_list;
  var source;
  if(mode==1){
    avaurl = app.globalData.userInfo.avatarUrl;
  }
  else{
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

  if(type == 'button'){
    var message = {
      myself:0,
      head_img_url:botURL,
      'msg_type':'button',
      content:'',
      create_time:util.formatTime(new Date()),
      showtime: show,
      showbutton: true,
    }
    message_list.push(message)
   this.setData({showInput:false})
  }
  else
  {
    var message = {
      myself: mode,
      head_img_url: avaurl,
      'msg_type': type,
      'content': content,
      create_time: util.formatTime(new Date()),
      showtime: show,
      showbutton: true,
    }
    message_list.push(message);
  }
  that.setData({
    message_list: message_list,
    content: ''
  })
  that.scrollToBottom()
},

  waitTitle: function () {
    wx.setNavigationBarTitle({
      title: '对方正在输入...'
    })
    for (var i = 0; i < 500; i++); //等待时间
  },
  showTitle: function () {
    wx.setNavigationBarTitle({
      title: '帮助手册'
    })
  },

/**
 * 页面初始信息
 */
onLoad: function () {
  //y页面初始化时加载的原始数据
  // 设置标题
  wx.setNavigationBarTitle({
    title: '帮助手册'
  })

  if (app.globalData.userInfo) {
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  }
  if(app.globalData.openId){
    this.setData({
      openId: app.globalData.openId,
      hasOpenId: true
    })
  }

}

})