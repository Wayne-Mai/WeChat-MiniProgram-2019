//app.js
App({
  onLaunch: function () {
    //云开发初始化
    wx.cloud.init({
        traceUser:true,
        env:"club-fjib9"
      })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log("SUCCESS")
      }
    })
    
  },
  globalData: {
    userInfo: null
  }
})