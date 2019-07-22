// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//云数据库
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return db.collection("group_notices").doc(event.noticeId).remove({
    success: function (res) {
      console.log("This delete success");
    }
  })

}