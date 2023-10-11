// pages/rili/rili.js
Page({

  /**
   * 页面的初始数据1
   */
  data: {
    show: false,
    monitorName:'',
    meetingNumber:'',
    startTime: '',
    endTime: '',
    date:'',
    dateList: [], //存放日期的数组
    nowDate: '', //系统当前日期
    courseRecord:[],
    studentsArray:[],
    //避免加载不及时卡顿或者请求次数过多的节流操作
    click:-1
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

  // 获取日期详情
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var mentorAccount = options.mentorAccount;

      var that = this;
      var myDate = new Date(); //获取系统当前时间
      var sysmonth = myDate.getMonth() + 1
      var nowDate = myDate.getDate(); //当前是本月几日
      var today = myDate.toLocaleDateString(); //今日年月日
      that.setData({
          nowDate: nowDate,
          sysmonth: sysmonth,
          // 把导生姓名传进来
          mentorAccount:mentorAccount
      }),
      console.log('系统日期1：', myDate);
      console.log('系统日期（年/月/日）：', today);
      console.log('系统日期（月）：', sysmonth);
      console.log('系统日期（日）：', nowDate);

      // 获取屏幕宽度，设置每个日期宽度
      // wx.getSystemInfo({
      //     success: (res) => {
      //         console.log(res);
      //         this.setData({
      //             windowWidth: res.windowWidth,
      //             itemWidth: parseInt(res.windowWidth / 7)
      //         });
      //     },
      // })
      this.initData();

      console.log(options.mentorAccount)
      // 查询数据库
      wx.cloud.database().collection("course")
      .where({
        // date:standardTime
        // monitorName:this.data.mentorAccount
        monitorName:options.mentorAccount
      })
      
      .get()
      .then(res=>{
        // console.log("查询",standardTime,"成功")
        console.log(res)
        this.setData({
          courseRecord:res.data
        })
      })
      .catch(err =>{
        console.log("查询失败")
      })
      // 完成数据更新后的节流关闭操作
      .finally(()=>{
        this.setData({
          click:-1
        })
      })
  },

  // 初始化日期
  initData() {
      const nowDateTime = +new Date();
      let dateList = [];
      // 当前日期的 往后7天
      for (let i = 0; i < 7; i++) {
          let obj = this.getDateInfo(nowDateTime + i * 24 * 60 * 60 * 1000);
          obj.isChoose = i == 0;
          dateList.push(obj);
      }
      this.setData({
          dateList,
          clickIndex: 0,
          scrollLeftIndex: 15

      });
      console.log(this.data.dateList);
  },

  // 点击日期方法
  clickDate(e) {
      // var that = this;
      // console.log('点击日期携带的下标：', e.currentTarget.dataset.index); //当前的点击的日期
      // var index = e.currentTarget.dataset.index;
      // that.setData({
      //     clickIndex: index
      // });
      // // console.log(that.data.scrollLeftIndex);
      // console.log('当前点击日期：', that.data.dateList[index].shortDateString); //当前点击的日期

      // const {
      // index
      // } = e.currentTarget.dataset;
      // this.setData({
      // clickIndex: index
      // });
      // console.log(this.data.dateList[index]);


      var that = this;
      console.log('点击日期携带的下标：', e.currentTarget.dataset.index); //当前的点击的日期
      var index = e.currentTarget.dataset.index;
      if (that.data.click!=-1){
        return
      }
      // 完成数据更新后的节流操作
      that.setData({
          clickIndex: index,
          click:index
      });
      // 获取标准（2022-2-1）格式的时间，用于查询数据库
      console.log('当前点击日期：', that.data.dateList[index].dateString.split(" ")[0].replace(/\//g, '-')); //当前点击的日期
      var standardTime=that.data.dateList[index].dateString.split(" ")[0].replace(/\//g, '-')


      // wx.cloud.database().collection("course")
      // .where({
      //   // date:standardTime
      //   monitorName:this.data.mentorAccount
      // })
      // .get()
      // .then(res=>{
      //   console.log("查询",standardTime,"成功")
      //   console.log(res)
      //   this.setData({
      //     courseRecord:res.data
      //   })
      // })
      // .catch(err =>{
      //   console.log("查询失败")
      // })
      // // 完成数据更新后的节流关闭操作
      // .finally(()=>{
      //   this.setData({
      //     click:-1
      //   })
      // })
      
  },


  // 跳转
  ToAdmStuList(e){
    var studentsInfo = e.currentTarget.dataset.course.studentsInfo;
    console.log(studentsInfo)
    wx.navigateTo({
      url: '../admStuList/admStuList?studentsInfo=' + JSON.stringify(studentsInfo),
    })
  },
})
