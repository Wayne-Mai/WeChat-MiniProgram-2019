const app = getApp();
const db = wx.cloud.database();
const group_notices=db.collection('group_notices');

Page({
  data: {
    isEmpty: false,//数据是否为空
    hasMore: true,//是否还有更多数据
    page: 1,//当前请求的页数
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  onShow: function () {
    // 页面显示
    this.onPullDownRefresh(1);//加载数据
  },
  onPullDownRefresh: function (isShowLoading) {
    
    var _pageThis=this;
    group_notices.get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        _pageThis.onSetData(res.data, 1);
        
      },
      fail:function(){
        console.log("Fail to get data from database");
      }
    })
  },
  print:function(){
    console.log("I am function")
  },
  onReachBottom: function () {
    if (!this.data.hasMore) {
      console.log("没有更多了...");
      wx.stopPullDownRefresh();
      return;
    }

  },
  onSetData: function (data, page) {
    //设置数据
    data = data || [];
    this.setData({
      page: page !== undefined ? page : this.data.page,
      data: page === 1 || page === undefined ? data : this.data.data.concat(data),
      hasMore: page !== undefined && data.length === 20,
      isEmpty: page === 1 || page === undefined ? data.length === 0 : false
    });
    console.log("Setting data on notice index");
  },
  onNavigateTap: function (e) {
    console.log(e.currentTarget.dataset.url)
    //跳转页面
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }
})