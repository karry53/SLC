const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
var today = new Date()
today.setDate(today.getDate()+1)
var todayDateString = today.toLocaleDateString(); //今日年月日
var tomorrowDateString = todayDateString.replace(/\//g, '-')
const db = cloud.database()
const studentsName = 'appointment'
const monitorName = 'course'

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const msgArr = await db
    .collection(studentsName)
    .where({
      date: "2023-10-12"//这里改时间
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
          "time49":{
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

    }
    // const msgArr1 = await db
    //   .collection(studentsName)
    //   .where({
    //     monitorName:"oo"
    //   })
    //   .get()

    // for (const msgData of msgArr1.data) {
    //   await cloud.openapi.subscribeMessage.send({
    //     touser: msgData._openid, 
    //     page: 'pages/index/index', 
    //     lang: 'zh_CN',
    //     templateId: '8yJjPqe6AhW7SQE363sNyodwRhaG1ytR_cY-_x8pbNU',
    //     miniprogramState: 'developer',
    //     data: {
    //       "thing96": {
    //         "value": msgData.courseName
    //       },
    //       "time49":{
    //         "value":msgData.date
    //       },
    //       "character_string88":{
    //         "value":msgData.conNumber
    //       },
    //       "thing8": {
    //         "value": "滴滴滴，您预约的课程明天上课啦！"
    //       }
    //     }
    //   })

    //   db
    //     .collection(monitorName)
    //     .doc(msgData._id)
    //     .update({
    //       data: {
    //         isSend: true
    //       },
    //     })
    // }
    return msgArr
  } catch (e) {
    return e
  }
}

