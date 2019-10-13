// pages/mine/myrecord/myrecord.js
const util = require('../../../utils/util.js')
const app = getApp()
const domain = 'https://xinyuJiang.cn/psybot/'

function mingxiang(canvas, width, height, F2) {

  ///////////////// 设置图表数据 //////////////////
  let chart = null;
  const data = app.globalData.mingxiang_resdata
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data, {
    mingxiang_times: {
      tickCount: 5
    }
    });
  chart.axis('mingxiang_type', {
    label:null,
    grid: null
  });
  chart.tooltip({
    showItemMarker: false,
    onShow(ev) {
      const { items } = ev;
      items[0].name = items[0].title;
      items[0].value = items[0].value +'次';
    }
  });
  chart.interval().position('mingxiang_type*mingxiang_times').color('mingxiang_type');
  chart.render();
  return chart;
}

function emotions(canvas, width, height, F2) {
  let chart = null;
  const data = app.globalData.emotion_resdata

  var length = data.length
  console.log(length)
  
  var originDates=[]
  var mindate
  if (length < 5)  mindate = data[0].date
  else  mindate = data [length-5].date
  data.forEach(obj => {
    if (obj.date >= mindate) {
      originDates.push(obj.date);
    }
  });

  chart = new F2.Chart({
    el: canvas,
    width,
    height,
    animate: false
  });

  chart.source(data, {
    date: {
      type: 'timeCat',
      tickCount: 5,
      values: originDates,
      mask: 'MM-DD'
    },
    value: {
      tickCount: 5
    }
  });
  
  chart.axis('date', {
    tickLine: {   //横坐标 点的长度
      length: 5,
      stroke: '#cacaca'
    },
    label: {
      fill: '#cacaca'
    },
    line: {
      top: true
    }
  });
  
  chart.tooltip({
    showItemMarker: false,
    background: {
      radius: 2,
      padding: [3, 5]
    },
    onShow(ev) {
      const { items } = ev;
      items[0].name = '';
      items[0].value = items[0].value + ' 分';
    }
  });

  chart.line().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
  chart.area().position('date*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
  
  chart.point()
    .position('date*value')
    .style({
      lineWidth: 1,
      stroke: '#fff'
    });

  chart.interaction('pan');
  // 定义进度条
  chart.scrollBar({
    mode: 'x',
    xStyle: {
      offsetY: -5
    }
  });

  
  chart.render();
  return chart;
}

Page({
  data: {
    
    userInfo: {},
    openid: '',
    user_id: '',
    wordcloud:'',
    is_emotion:'',
    is_mingxiang:'',


    classified_lists: [
      { title: '情绪档案', time: ['天', '周', '月'],  },
      { title: '冥想记录', time: ['次数', '时长'], },
    ],

    mingxiang: {
      lazyLoad: true,
    },
    emotions:{
      lazyLoad: true,
    },

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '情绪档案',
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
    this.setData({
      openid: app.globalData.openId,
      user_id: app.globalData.user_id,
    })

    //调取词云图
    wx.request({
      url: domain + 'getwordcloud/',
      data: {
        user_id: this.data.user_id,
      },
      method: 'get',
      success: res => {
        console.log("词云调取结果",res.data.msg)
        if(res.data.code == 0)
        {
          this.setData({
            wordcloud: res.data.data.url
          })
        }
            //调取情感数据
            wx.request({   
              url: domain + 'gettestgrade/',
              data: {
                user_id: this.data.user_id,
              },
              method: 'get',
              success: res => {
                 console.log('情感数据',res.data.data)
                var emotion_data_length = res.data.data.length
                //console.log(emotion_data_length)
                var emotion_resdata = []
                for (var i = 0; i < emotion_data_length;i++)
                {
                  var emotion_data = {
                    date:res.data.data[i][0],
                    value: res.data.data[i][1]
                  }
                  emotion_resdata.push(emotion_data)
                }
                console.log(emotion_resdata)
                
                if (emotion_resdata.length > 0){
                  this.setData({
                    is_emotion:true
                  })
                }
                else{
                  this.setData({
                    is_emotion: false
                  })
                }
                app.globalData.emotion_resdata = emotion_resdata
                let emotionschart = this.selectComponent('#scroll');
                emotionschart.init(emotions)
                

                wx.request({   //调取冥想数据
                  url: 'https://xinyuJiang.cn/psybot/mingxiang_stat/',
                  data: {
                    user_id: this.data.user_id,
                  },
                  method: 'get',
                  success: res => {
                    var mingxiang_record = res.data.data  //获取调取接口得到的冥想数据
                    console.log('冥想次数数据', res.data.data)
                    var mingxiang_type_times = []   //存储数据格式转换后的 冥想数据 类型+次数\
                    var length = mingxiang_type_times.length
                    var sum_times = 0

                    for (var key in mingxiang_record) {
                      var mingxiang_data = {
                        mingxiang_type: key,
                        mingxiang_times: mingxiang_record[key]
                      }
                      sum_times = sum_times + mingxiang_record[key] //计算冥想次数总和
                      console.log(mingxiang_data)
                      mingxiang_type_times[length] = mingxiang_data;
                      length = length + 1;
                    }
                    
                    if (sum_times != 0){
                      this.setData({
                        is_mingxiang:true
                      })
                    }
                    else{
                      this.setData({
                        is_mingxiang: false
                      })
                    }
                    app.globalData.mingxiang_resdata = mingxiang_type_times
                    let mingxiangchart = this.selectComponent('#column-dom');
                    mingxiangchart.init(mingxiang)
                    
              }
            })
          }
        }) 
      }
    })


  },
})




