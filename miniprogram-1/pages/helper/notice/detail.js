const app = getApp();
const db = wx.cloud.database();
const group_notices = db.collection('group_notices');


Page({
  noticeId: 0,
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.noticeId = options.id;
    console.log("option id");
    console.log(this.noticeId);
    wx.showShareMenu({
      withShareTicket: true
    })
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
    var _pageThis=this;
    group_notices.doc(this.noticeId).get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log("Setting single notice in detail");
        _pageThis.setData(res.data);
      },
      fail:function(){
        console.log("fail to query")
      }
    })

  },
  bindtapWrite: function () {
    wx.redirectTo({ url: 'write', })
  },
  onDeleteTap: function () {
    var _pageThis=this;
    if(app.globalData.user_id!=this.data._openid){
      wx.showToast({
        title: '错误!没有权限!',
        image: '../../../images/icon_error.png',  //image的优先级会高于icon
        duration: 2000
      })
    }
    //删除数据
    else{
      wx.showModal({
      content: '删除后将不能恢复，你确定要删除这条通知吗？', success: (res) => {
        if (!res.confirm) return;
        //TODO
        //进行删除操作
        wx.cloud.callFunction({
          // 云函数名称
          name: 'deleteNotice',
          // 传给云函数的参数
          data: {
            noticeId: _pageThis.noticeId,
          },
          success: function (res) {
            console.log("Cloud delete complete")
            console.log(res)
            // _pageThis.onPullDownRefresh()
            // this.onPullDownRefresh()
            wx.redirectTo({
              url: 'index',
            })
          },
          fail: console.error
        })
      }
      });
    }
  },
  onShowShareTap: function () {
    //显示分享
    var isShow = false;
    if (wx.showShareMenu) {
      // wx.showShareMenu({
      //   success: (res) => { isShow = true; }
      // });
    }
    setTimeout(() => {
      if (!isShow) {
        this.setData({ showShare: true });
        setTimeout(() => this.setData({ showShare: false }), 2500);
      }
    }, 200);
  },
  onShareAppMessage: function () {
    //分享页面
    return {
      title: this.data.title ? this.data.title : '群通知',
      path: 'pages/helper/notice/read?id=' + this.noticeId,
      success: function (res) {
        // 转发成功
        console.log(res)
        // 只有转发到群聊中打开才可以获取到 shareTickets 返回值，单聊没有 shareTickets
        if (res.shareTickets && res.shareTickets.length > 0) {
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: (res) => {
              console.log('已成功获取到加密信息')
              console.log(res)
            },
            fail: (res) => {
              console.log(res)
            }
          })
        }
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    };
  }
})