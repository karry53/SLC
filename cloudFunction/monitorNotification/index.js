const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
var today = new Date()
today.setDate(today.getDate()+1)
var todayDateString = today.toLocaleDateString(); //今日年月日
const tomorrowDateString = todayDateString.replace(/\//g, '-')
const db = cloud.database()
const collectionName = 'course'

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const msgArr = await db
    .collection(collectionName)
    .where({
      date:tomorrowDateString,
    })
    .get()

    for (const msgData of msgArr.data) {
      await cloud.openapi.subscribeMessage.send({
        touser: msgData._openid, 
        page: 'pages/index/index', 
        lang: 'zh_CN',
        templateId: '8yJjPqe6AhW7SQE363sNyodwRhaG1ytR_cY-_x8pbNU',
        miniprogramState: 'developer',
        data: {
          "thing96": {
            "value": msgData.courseName
          },
          "time49":{//这里是调具体时间的，注意有格式要求，必须是“2022-10-23 12：00-14：00”其中不能省略空格
            "value":msgData.date
          },
          "character_string88":{
            "value":msgData.conNumber
          },
          "thing8": {
            "value": "滴滴滴，您预约的课程明天上课啦！"
          }
        }
      })

      db
        .collection(collectionName)
        .doc(msgData._id)
        .update({
          data: {
            isSend: true
          },
        })
    }
 
    return msgArr
  } catch (e) {
    return e
  }
}
