// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event);
  console.log("Above should make sense")
  
  var thisNotice = db.collection("group_notices").doc(event.noticeId);
  var t1 = wxContext.OPENID;
  var t2 = event.headimgurl;
  var t3 = event.nickname;
  console.log(t3);
  return db.collection("group_notices").doc(event.noticeId).update({
    data:{
      user_lists:db.command.push({
        user_id: wxContext.OPENID,
        headimgurl: event.headimgurl,
        nickname: event.nickname,
        is_click: true,
      }),
      click:db.command.inc(1)
    }
  })

  
}