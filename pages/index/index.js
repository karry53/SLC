// index.js
var courseData = [{
    courseName: '课程1',
    instructors: ['导生1', '导生2']
  },
  {
    courseName: '课程2',
    instructors: ['导生3', '导生4']
  },
  {
    courseName: '课程2',
    instructors: ['导生3', '导生4']
  },
  {
    courseName: '课程2',
    instructors: ['导生3', '导生4']
  },
  {
    courseName: '课程2',
    instructors: ['导生3', '导生4']
  },
  // 添加更多课程数据
];

Page({
  data: {
    courseData: courseData,
    notices: ['SLC预约问询课程形式:学生可以参照导生的可预约时间，在本程序中预约导生课程，以线上会议进行辅导。SLC导生将为您答疑课程学习中的问题，需学生准备好学习问题前来询问。', '1、预约课程需提前24h，取消课程需提前2h (无故或临时取消将列为不良记录)', '2、每天晚上10点截止预约'],



    // 课程显示
    activeNames: ['1'],
    clickDate : [],
    appointmentRecord:[],
    pageSize: 20,

  },

  
 // 格式化日期，时间
  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },
  // 格式化数字
formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
},

  getDateInfo(ts) {
    const date = new Date(ts);
    const weekArr = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
    const week = date.getDay();
    let dateString = this.formatTime(date);
    let shortDateString = dateString.replace(/\//g, '-').substring(5, 10).replace(/-/g, '月') + "日";
    if (date.getDate() < 10) {
        shortDateString = shortDateString.replace(/0/g, '');
    }
    return {
        shortDateString,
        dateString,
        month: date.getMonth() + 1,
        day: date.getDate(),
        week: weekArr[week]
    }
  },


  onLoad() {
    const nowDateTime = +new Date();
    const getWeekDate = new Date();
    // 计算今天是今周的第几天
    const weekDateTime = getWeekDate.getDay()
    // console.log('week是', weekDateTime)

    // 计算本周的起始日期（假设星期一为一周的第一天）
    const weekStartDateTime = nowDateTime - (weekDateTime - 1) * 24 * 60 * 60 * 1000;

    let dateList = [];
      // 当前日期的 今周七天
      for (let i = 0; i < 7; i++) {
          let obj = this.getDateInfo(weekStartDateTime + i * 24 * 60 * 60 * 1000);
          obj.isChoose = i === weekDateTime-1;
          dateList.push(obj);
          // console.log('obj',obj,obj.isChoose)
      }
// 格式化时间
      const clickDate = []
      for(let i=0; i<7; i++){
        var clickTime=dateList[i].dateString.split(" ")[0].replace(/\//g, '-');
        clickDate.push(clickTime);
      }
      this.setData({
          dateList,
          clickIndex: weekDateTime-1,
          scrollLeftIndex: 15,
          clickDate:clickDate

      });

      this.queryDatabase();
  },

 
  queryDatabase() {
    const { appointmentRecord } = this.data;
    const pageSize = 20;
    let skipCount = 0; 
    const that = this; 
  
    function fetchData() {
      wx.cloud
        .database()
        .collection("course")
        .skip(skipCount)
        .limit(pageSize)
        .get()
        .then((res) => {
          console.log("查询成功");
          console.log(res);
          const newRecords = res.data;
  
          if (newRecords.length > 0) {
            that.setData({
              appointmentRecord: that.data.appointmentRecord.concat(newRecords),
            });
            skipCount += pageSize;
  
            fetchData();
          } else {
            console.log("所有数据加载完毕");
          }
        })
        .catch((err) => {
          console.log("查询失败");
        });
    }

    fetchData();
  },
  

  onChange(event) {
    console.log(event)
    this.setData({
      activeNames: event.detail,
    });


  },

  onOpen(event) {
    console.log('open',event.detail)
    // 格式化时间
    var standardTime = this.data.clickDate[event.detail]
    
    // 查找匹配日期的courseName
  const courseNames = [];
  
  for (const record of this.data.appointmentRecord) {
    if (record.date === standardTime) {
      courseNames.push(record.courseName);
      const dataKey = `appointmentRecord[${event.detail}].courseName`;
      console.log('datakey',dataKey)
    }
  }

  // 将匹配的courseName存储在页面数据中
  this.setData({
    openCourseNames: courseNames,
  });
  },

  onClose(event) {
    console.log('close',event.detail)
    // Toast(`关闭: ${event.detail}`);
  },

  navigateToUserForm() {
    wx.navigateTo({
      url: '../userForm/userFrom',
    })
  },

  switchTabUserRecord() {
    wx.switchTab({
      url: '../userRecord/userRecord',
    })
  }


})