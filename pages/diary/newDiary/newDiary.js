// pages/diary/newDiary/newDiary.js
const util = require('../../../utils/util.js')
const domain_w = 'https://consultant.yiwangchunyu.wang/';
const app = getApp()
var bmap = require('../bmap-wx.min.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: '',
    date: '',
    week: '',
    weatherData: '',
    weatherSuggestion: '',
    label_list: [
      { text: '生气', color: '#f15959', backgroundcolor: '#fae9e9' },
      { text: '难过', color: '#18e2d1', backgroundcolor: '#eefcfb' },
      { text: '疲惫', color: '#18a2e2', backgroundcolor: '#ebf6fc' },
      { text: '焦虑', color: '#e27a18', backgroundcolor: '#fcf4ed' },
      { text: '平静', color: '#27da2f', backgroundcolor: '#f0fff0' },
      { text: '开心', color: '#f75bb0', backgroundcolor: '#fff0f8' },
      { text: '兴奋', color: '#f7c65b', backgroundcolor: '#fffaf0' },
      { text: '惊喜', color: '#822dc7', backgroundcolor: '#f4ebfc' },
      { text: '无感', color: '#545752', backgroundcolor: '#f0f0f0' }],
    label_text: '心情怎样?',
    label_number: 5,
    location: '地球上的某个角落',
    location_length: 150,
    lon:'',
    lat:'',
    is_choosing_Label: false,
    images: [],
    photo_num: 0,
    text_num: 0,
  },
  /*
     获取位置权限
  */
  getlocation: function () {
    var obj = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序调用地址
              wx.chooseLocation({
                success: function (res) {
                  var name = res.name
                  var location_length = res.name.length
                  obj.setData({
                    location: name,
                    location_length: location_length * 14 + 40,
                    lat: res.latitude,
                    lon: res.longitude
                  })
                }
              })
            }
          })
        }
        else {
          wx.chooseLocation({
            success: function (res) {
              var name = res.name
              var location_length = res.name.length
              obj.setData({
                location: name,
                location_length: location_length * 14 + 40,
                lat: res.latitude,
                lon: res.longitude
              })
            }
          })
        }
      }
    })
  },
  /*
     点击心情标签
  */
  changelabel: function () {
    this.setData({
      is_choosing_Label: true
    })
  },
  /*
     更改心情标签
  */
  confirmLabel: function (e) {

    var index = e.currentTarget.dataset.label
    var label_list = this.data.label_list
    console.log(e.currentTarget.dataset.label)
    this.setData({
      is_choosing_Label: false,
      label_text: label_list[index].text,
      label_number: index,
    })

  },

  /*
     上传图片
  */
  upload: function () {
    var that = this;
    var arr = new Array();
    wx.chooseImage({
      //一次性最多选择的图片张数
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        arr = arr.concat(that.data.images);
        wx.uploadFile({
          url: domain_w + 'service/upload/uploadDiaryImg',
          filePath: tempFilePaths[0],
          name: 'images',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: res => {
            var test = JSON.parse(res.data)
            var image_url = test.data.split('[')[1].split(']')[0].split('"')[1]
            arr.push(image_url);

            that.setData({
              images: arr,
              photo_num: arr.length
            })
            console.log('images', that.data.images)

          }
        })

      }

    })
  },

  /*
     预览图片
  */
  preview: function (e) {
    wx.previewImage({
      current: e.target.dataset.id,
      urls: this.data.images
    })
  },

  /*
     删除图片
  */
  delete_photo:function(e){
    var index = e.currentTarget.dataset.index;
    var images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images: images,
      photo_num:images.length
    })

  },
  
  /*
     页面加载
  */
  onLoad: function () {
    //y页面初始化时加载的原始数据
    // 设置标题

    var diaryTime = util.diaryTime_new(new Date())

    this.setData({
      date: diaryTime.date,
      week: diaryTime.week,
      user_id: app.globalData.user_id
    })
    
    // 新建百度地图对象 
    // 查询天气
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'TUsDLdOvHyGb1NeLS3xPel76ZI67roL3'  // 我们的秘钥
    });
    var fail = function (data) {
      that.setData({
        weatherData: '',
        weatherSuggestion: ''
      });
    };
    var success = function (data) {
      var weatherData = data.currentWeather[0];
      var weatherSuggestion = data.originalData.results[0].index
      weatherData = weatherData.weatherDesc;
      weatherSuggestion = weatherSuggestion[0].title + '：' + weatherSuggestion[0].des
      //天气内容自取
      that.setData({
        weatherData: weatherData,
        weatherSuggestion: weatherSuggestion
      });
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    });
  },

  /*
     日记字数统计
  */
  wordCount: function (e) {
    var value = e.detail.value
    this.setData({
      text_num: value.length
    })
  },

  /*
     提交日记所有数据
  */
  bindFormSubmit: function (e) {
    var title = e.detail.value.title
    var content = e.detail.value.content
    if (title == '') {
      wx.showToast({
        icon: 'none',
        title: '标题不能为空'
      });
      return;
    }
    else if (content == '') {
      wx.showToast({
        icon: 'none',
        title: '内容不能为空'
      });
      return;
    }
    else {
      var loc = {
        lon:this.data.lon,
        lat:this.data.lat,
        name:this.data.location
      }
      wx.request({
        url: domain_w + 'service/diary/create',
        data: {
          user_id: this.data.user_id,
          label: this.data.label_number,
          title: title,
          content: content,
          weather:this.data.weatherData,
          loc: JSON.stringify(loc),
          adv: this.data.weatherSuggestion,
          images: JSON.stringify(this.data.images),
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        success: function (res) {
          wx.showToast({
            title: '',
            icon: 'success',
            duration: 6000,
            success: function () {
              wx.reLaunch({
                url: '../diary',
              })
            }
          });
        }
      })

    }
  },


})