
const app = getApp();
const db = wx.cloud.database();
const group_notices = db.collection('group_notices');
var util = require('../../../utils/util.js');

Page({
  noticeId: 0,
  
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.noticeId = options.id;

    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        console.log('callFunction test result: ', res),
        app.globalData.user_id = res.result.openid;
        console.log("新获取用户id成功"+app.globalData.user_id)
      }
    });
    
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.onPullDownRefresh();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {

    //页面刷新
    console.log("Here is read")
    var _pageThis = this;
    var my_click=false;
    group_notices.doc(this.noticeId).get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log("Setting single notice in read,its id:");
        console.log(_pageThis.noticeId);
        _pageThis.setData(res.data);
        var i=0,n=res.data.user_lists.length;
        for(;i!=n;i++){
          if (res.data.user_lists[i].user_id==app.globalData.user_id){
            my_click=true;
            console.log("Change?wtf")
            _pageThis.setData({
              is_click: res.data.user_lists[i].is_click
            });
          }
        }
        if(my_click==false){
          console.log("Click set to false");
          _pageThis.setData({    
            is_click: false
          });
        }
        wx.stopPullDownRefresh;
      },
      fail: function () {
        console.log("fail to query")
      }
    })
  },
  onClickTap: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
        success: function (res) {
          console.log("存用户数据成功")
        }
      })
    };

    console.log("check undefine")
    console.log({
      noticeId: this.noticeId,
      headimgurl: app.globalData.userInfo.avatarUrl,
      nickname: app.globalData.userInfo.nickName,
    })
    var _pageThis=this;
    //查看通知,使得阅读次数加一
    wx.cloud.callFunction({
      // 云函数名称
      name: 'readNotice',
      // 传给云函数的参数
      data: {
        noticeId:_pageThis.noticeId,
        headimgurl: app.globalData.userInfo.avatarUrl,
        nickname: app.globalData.userInfo.nickName
      },
      success: function (res) {
        console.log("Cloud read complete")
        console.log(res)
        _pageThis.onPullDownRefresh()
        this.onPullDownRefresh()
      },
      fail: console.error
    })
    
  },

  onShareAppMessage: function () {
    //分享页面
    return {
      title: this.data.title ? this.data.title : '群通知',
      path: 'pages/helper/notice/read?id=' + this.noticeId
    };
  }
})