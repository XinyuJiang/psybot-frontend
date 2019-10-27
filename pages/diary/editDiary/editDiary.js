// pages/diary/newDiary/newDiary.js
const util = require('../../../utils/util.js')
const domain_w = 'https://consultant.yiwangchunyu.wang/';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    diaryid:'',
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
    label_text: '',
    label_number:0,
    location: '地球上的某个角落',
    location_length: 150,
    lon: '',
    lat: '',
    title:'',
    content:'',
    is_choosing_Label:false,
    images: [],
    photo_num: 0,
    text_num: 0,
  },
  changelabel:function(){
    this.setData({
      is_choosing_Label: true
    })
  },
  confirmLabel:function(e){

    var index = e.currentTarget.dataset.label
    var label_list = this.data.label_list
    this.setData({
      is_choosing_Label: false,
      label_text: label_list[index].text,
      label_number:index,
    })

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
     删除图片
  */
  delete_photo: function (e) {
    var index = e.currentTarget.dataset.index;
    var images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images: images,
      photo_num: images.length
    })

  },
  bindFormSubmit: function (e) {
    var diaryid = this.data.diaryid
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
        lon: this.data.lon,
        lat: this.data.lat,
        name: this.data.location
      }
      var update = {
        label: this.data.label_number,  // label: 10,
        title: title,           // title: 'xxxxx',
        content: content,        // content: 'xxxxx'
        loc: JSON.stringify(loc),
        images: JSON.stringify(this.data.images),
      }
      wx.request({
        url: domain_w + 'service/diary/update',
        data: {
          id: diaryid,
          update: JSON.stringify(update)
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        success: function (res) {
          

          wx.reLaunch({
            url: '../diary',
          })

        }
      })

    }
  },

  showModal(name) {
    this.setData({
      modalName: name
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  onLoad: function (options) {
    //y页面初始化时加载的原始数据
    // 设置标题

    var diaryid = options.diaryid
    var diaryTime = util.diaryTime_new(new Date())
    
    this.setData({
      diaryid:diaryid,
      date: diaryTime.date,
      week: diaryTime.week
    })
    

    this.showModal('DialogModal');

    wx.request({
      url: domain_w + 'service/diary/list',
      data: {
        id: diaryid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success: res => {
        console.log(res)
        var resdiary = res.data.data.diary[0]
        if (resdiary.loc) {
          var location_length = JSON.parse(resdiary.loc).name.length
          this.setData({
            location: JSON.parse(resdiary.loc).name,
            location_length: location_length * 14 + 40,
            lon: JSON.parse(resdiary.loc).lon,
            lat: JSON.parse(resdiary.loc).lat
          })
        }

        this.setData({
          label_text: this.data.label_list[resdiary.label].text,
          label_number: resdiary.label,
          title: resdiary.title,
          content: resdiary.content,
          text_num: resdiary.content.length,
          images: resdiary.images,
          photo_num: resdiary.images.length,
          week: resdiary.ctime_weekday,
        })
      }
    })


  }
 
})