const app = getApp();
const db = wx.cloud.database();
const group_notices = db.collection('group_notices');
var util = require('../../../utils/util.js');


Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getUserInfo:function(e){
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
  },
  onPushSubmit: function (e) {
    //事件提交
      while(app.globalData.userInfo){
      group_notices.add({
        // data 字段表示需新增的 JSON 数据
        data: {
          //表单数据段
          title:e.detail.value.title,
          remark:e.detail.value.remark,
          nickname: app.globalData.userInfo.nickName,
          headimgurl: app.globalData.userInfo.avatarUrl,
          create_time: util.formatTime(new Date()),
          click:1,
          // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          description: "learn cloud database",
          user_lists: [{
            user_id: app.globalData.user_id,
            headimgurl:app.globalData.userInfo.avatarUrl,
            nickname: app.globalData.userInfo.nickName,
            is_click:true,
            }
          ],
          // 为待办事项添加一个地理位置（113°E，23°N）
          location: new db.Geo.Point(113, 23),
          is_click:true,
          done: false
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res),
          wx.redirectTo({ url: 'index' });
            // wx.redirectTo({ url: 'index' });
        }
      });
      break;
    }
  }
})