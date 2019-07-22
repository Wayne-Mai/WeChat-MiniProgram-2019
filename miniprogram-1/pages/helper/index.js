//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    shareInfo: null,//分享信息
    motto: 'Hello World',
    
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onNavigateTap: function (e) {
    //跳转页面
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    }),
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        console.log('callFunction test result: ', res),
        app.globalData.user_id=res.result.openid
      }
    });
    
    
  },

  onShareAppMessage: function (res) {
    this.shareInfo = this.shareInfo || {};
    const title = this.shareInfo.title || '社团帮';
    const desc = this.shareInfo.desc || '';
    return {
      title: title,
      desc: desc,
      path: '/pages/helper/index',
      
      success: function (res) {
        // 转发成功
        // 只有转发到群聊中打开才可以获取到 shareTickets 返回值，单聊没有 shareTickets
        if (res.shareTickets && res.shareTickets.length > 0) {
          wx.getShareInfo({
            shareTicket:res.shareTickets[0],
            success: (res) => {
              console.log('已成功获取到加密信息')
              
            },
            fail: (res) => {
              console.log("Fail to get shareTicket")
            }
          })
        }
      },
      fail: function (res) {
        // 转发失败
        console.log("Fail to forward")
      }
    };
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
