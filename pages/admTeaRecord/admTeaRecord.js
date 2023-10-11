// pages/admTeaRecord/admTeaRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    monitorName:'',
    courseName:'',
    conNumber:'',
    startTime: '',
    endTime: '',
    date:'',
    dateList: [], //存放日期的数组
    nowDate: '', //系统当前日期
    appointmentRecord:[],
    //避免加载不及时卡顿或者请求次数过多的节流操作
    click:-1,
    //改变的导生姓名，导生名称，导生会议号，时间
    changeMonitorName:"",
    changeMeetingNum:"",
    changeCourseName:"",
    changeDate:'',
    changeStartTime:"",
    changeEndTime:"",
    _id:"",
    //存储e
    e:{},

    clickIndex :''
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
  cancelUpdate(){
    this.setData({ show: false });
  },
  onClickShow(e) {
    console.log(e.currentTarget.dataset._id)
    this.setData({ 
      show: true,
      _id:e.currentTarget.dataset._id
    });
    console.log(this.data._id)
  },

  onClickHide() {
    this.setData({ show: false });
  },

  noop() {},

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var myDate = new Date(); //获取系统当前时间

    var sysmonth = myDate.getMonth() + 1
    var nowDate = myDate.getDate(); //当前是本月几日
    var today = myDate.toLocaleDateString(); //今日年月日
    that.setData({
        nowDate: nowDate,
        sysmonth: sysmonth
    }),
    today = today.replace(/\//g, '-')
    console.log('系统日期1：', myDate);
    console.log('系统日期（年/月/日）：', today);
    console.log('系统日期（月）：', sysmonth);
    console.log('系统日期（日）：', nowDate);
    this.initData();
  },
   // 初始化日期
  initData() {
      const nowDateTime = +new Date();
      const getWeekDate = new Date();
      // console.log('noeDateTime是',nowDateTime)
      // 计算今天是今周的第几天
      const weekDateTime = getWeekDate.getDay()
      console.log('week是',weekDateTime)

      // 计算本周的起始日期（假设星期一为一周的第一天）
  const weekStartDateTime = nowDateTime - (weekDateTime - 1) * 24 * 60 * 60 * 1000;

      let dateList = [];
      // 当前日期的 往后7天
      for (let i = 0; i < 7; i++) {
          let obj = this.getDateInfo(weekStartDateTime + i * 24 * 60 * 60 * 1000);
          obj.isChoose = i === weekDateTime-1;
          dateList.push(obj);
          console.log('obj',obj,obj.isChoose)
      }
      this.setData({
          dateList,
          clickIndex: weekDateTime-1,
          scrollLeftIndex: 15

      });
      console.log(this.data.dateList);
  },

  // 点击日期方法
  clickDate(e) {
    console.log(e,"zhezhexhe")
    this.setData({
      e:{...e}
    })
    console.log(this.data.e,"ssfafsfa")
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

      wx.cloud.database().collection("course")
      .where({
        date:standardTime
      })
      .get()
      .then(res=>{
        console.log("查询",standardTime,"成功")
        console.log(res)
        this.setData({
          appointmentRecord:res.data
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

  //修改导生姓名
  changeMonitorName(e){
    console.log(e.currentTarget.dataset._id)
    this.setData({ 
      show: true,
      _id:e.currentTarget.dataset._id
    });
    wx.showModal({
      title: '请输入修改的导生姓名',
      // content: '啥啥啥',
      editable:true
    })
    .then(res => {
      console.log(res.content)
      if(res.confirm){
        this.setData({
          changeMonitorName:res.content
        })
          wx.cloud.database().collection("course")
          .where({
            _id:this.data._id
          })
          .update({
            data:{
              monitorName:this.data.changeMonitorName
            }
          })
          .then(res => {
            console.log("修改成功")
            this.clickDate(this.data.e)
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
   //修改课程名称
   changeCourseName(e){
    console.log(e.currentTarget.dataset._id)
    this.setData({ 
      show: true,
      _id:e.currentTarget.dataset._id
    });
    wx.showModal({
      title: '请输入修改的课程名称',
      // content: '啥啥啥',
      editable:true
    })
    .then(res => {
      console.log(res.content)
      if(res.confirm){
        this.setData({
          changeCourseName:res.content
        })
        wx.cloud.database().collection("course")
        .where({
          _id:this.data._id
        })
        .update({
          data:{
            courseName:this.data.changeCourseName
          }
        })
        .then(res => {
          console.log(res)
          console.log("修改成功")
          this.clickDate(this.data.e)
        })
        .catch(err => {
          console.log(err)
        })
    }
    })
    .catch(err => {
      console.log(err)
    })
    // wx.cloud.database().collection("course")
    //       .where({
    //         date:standardTime
    //       })
    //       .get()
    //       .then(res=>{
    //         console.log("查询",standardTime,"成功")
    //         console.log(res)
    //         this.setData({
    //           appointmentRecord:res.data
    //         })
    //       })
    //       .catch(err =>{
    //         console.log("查询失败")
    //       })
    
  },
  //修改课程会议号
  changeMeetingNum(e){
    console.log(e.currentTarget.dataset._id)
    this.setData({ 
      show: true,
      _id:e.currentTarget.dataset._id
    });
    wx.showModal({
      title: '请输入修改的会议号',
      // content: '啥啥啥',
      editable:true
    })
    .then(res => {
      console.log(res.content)
      if(res.confirm){
        this.setData({
          changeMeetingNum:res.content
        })
          wx.cloud.database().collection("course")
          .where({
            _id:this.data._id
          })
          .update({
            data:{
              conNumber:this.data.changeMeetingNum
            }
          })
          .then(res => {
            console.log("修改成功")
            this.clickDate(this.data.e)
          })
          .catch(err => {
            console.log(err)
          })
      }
      
    })
    .catch(err => {
      console.log(err)
    })
  },
  //修改课程日期
  changeDate(e){
    console.log(e.currentTarget.dataset.date)
    wx.showModal({
      title: '请输入修改的课程日期',
      content: e.currentTarget.dataset.date,
      editable:true
    })
    .then(res => {
      console.log(res.content)
      if(res.confirm){
        console.log(res.content)
        this.setData({
          changeDate:res.content,
        })
        wx.cloud.database().collection("course")
          .where({
            _id:this.data._id
          })
          .update({
            data:{
              date:this.data.changeDate
            }
          })
          .then(res => {
            console.log("修改成功")
            this.setData({
              show:false
            })
            this.clickDate(this.data.e)
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
  //修改课程开始时间
  changeStartTime(e){
    wx.showModal({
      title: '请输入修改的课程开始时间',
      content: e.currentTarget.dataset.starttime,
      editable:true
    })
    .then(res => {
      console.log(e)
      console.log(res.content)
      
      if(res.confirm){
        console.log(res.content)
        this.setData({
          changeStartTime:res.content
        })
        wx.cloud.database().collection("course")
          .where({
            _id:this.data._id
          })
          .update({
            data:{
              startTime:this.data.changeStartTime
            }
          })
          .then(res => {
            console.log("修改成功")
            this.clickDate(this.data.e)
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
  //修改课程结束时间
  changeEndTime(e){
    console.log(e.currentTarget.dataset)
    wx.showModal({
      title: '请输入修改的课程结束时间',
      content: e.currentTarget.dataset.endtime,
      editable:true
    })
    .then(res => {
      console.log(res.content)
      if(res.confirm){
        console.log(res.content)
        this.setData({
          changeEndTime:res.content
        })
        wx.cloud.database().collection("course")
          .where({
            _id:this.data._id
          })
          .update({
            data:{
              endTime:this.data.changeEndTime
            }
          })
          .then(res => {
            console.log("修改成功")
            this.clickDate(this.data.e)
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
  onReady() {
  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})