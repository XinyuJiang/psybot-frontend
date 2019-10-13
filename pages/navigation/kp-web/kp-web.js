// pages/navigation/kp-web/kp-web.js
Page({
  data: {
    src:'',
  },


  onLoad: function (options) {
    this.setData({
      src: options.src,
    })
    console.log(this.data.src)

  },
})