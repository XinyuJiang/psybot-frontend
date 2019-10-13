//app.js
const app=getApp()
const loginurl = 'https://xinyujiang.cn/psybot/register/'
const openidurl ='https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code'
const domain = 'https://xinyuJiang.cn/psybot/'
App({
  globalData: {
    userInfo: null,
    code: '',
    isFirstCode: '',
    openId: '',
    user_id:'',
    mingxiang_resdata:'',
    emotion_resdata:'',
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var index = this.globalData.user_id
    //console.log('没登陆', index)
    //while()
    // 登录
    wx.login({
      success: res => {
        if(res.code){
          //console.log(res.code)
          this.globalData.code=res.code
          console.log('code:',this.globalData.code)
         // 获取用户信息
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {

                    this.globalData.userInfo = res.userInfo
                    console.log('用户信息获取成功')
                    console.log(this.globalData.userInfo)
                    if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res)
                    }

                   // var that = this
                    wx.request({
                      url: loginurl,
                      data: {
                        nickname: this.globalData.userInfo.nickName,
                        portrait: this.globalData.userInfo.avatarUrl,
                        code: this.globalData.code
                      },
                      method: 'GET',
                      header: { 'content-type': 'application/json' },
                      success: res => {
                        console.log('openid获取', res.data.msg)
                        this.globalData.isFirstCode = res.data.code
                        this.globalData.openId = res.data.data.openid
                        console.log('openid', this.globalData.openId)  
                        
                        //var that = this
                        console.log(this)
                        wx.request({
                          url: domain + 'getuserid/',
                          data: {
                            openid: this.globalData.openId
                          },
                          method: 'get',
                          success: res => {
                            //console.log(res.data.data)
                            this.globalData.user_id = res.data.data
                            console.log('userid', this.globalData.user_id)

                             },
                          complete: res => {
                            index = this.globalData.user_id
                            console.log('完成getSetting', index)
                          },
                          })

                      }

                    })
                  }
                })
              }
            }


        })
      }
      }
    })
  }
 
})