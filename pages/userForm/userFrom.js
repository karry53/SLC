// pages/userForm/userFrom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    number: "",
    major: "",
    email: "",
    courseName: "",
    monitorName: "",
    date: "",
    syllabus: "",
    startTime: '',
    endTime: '8:30',
        // 导生日期可选区间
    delayTime:14,
    start:"",
    end:"",
    //控制是否可提交
    status:false,
    //学生的信息存储（名字和问题）
    studentsInfo:[],

    conNumber:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var myDate = new Date()
    console.log(myDate)
    var today = myDate.toLocaleDateString(); //今日年月日
    today = today.replace(/\//g, '-')
     myDate.setDate(myDate.getDate()+this.data.delayTime)
     var endTime =myDate.toLocaleDateString().replace(/\//g, '-')
    console.log(endTime)
    // console.log(today)
    this.setData({
      start:today,
      end: endTime
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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

  },

  //获取姓名 
  inputUserName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  inputNumber(e) {
    this.setData({
      number: e.detail.value
    })
  },

  inputMajor(e) {
    this.setData({
      major: e.detail.value
    })
  },

  inputEmail(e) {
    this.setData({
      email: e.detail.value
    })
  },

  inputCourse(e) {
    this.setData({
      courseName: e.detail.value
    })
  },

  inputMonitorName(e) {
    this.setData({
      monitorName: e.detail.value
    })
  },

  //获取picker表时间
  bindDateChange(e) {
    // console.log(e.detail.value)
    // if (this.data.monitorName==""){
    //   wx.showModal({
    //     content: '请先填写课程和导生信息',
    //     showCancel:false
    //   })
    //   return
    // }
    this.setData({
      date: e.detail.value
    })
    //查询是否有课程可预约
    // wx.cloud.database().collection("course")
    // .where({
    //   monitorName:this.data.monitorName,
    //   date:this.data.date,
    //   courseName:this.data.courseName
    // })
    // .get()
    // .then(res => {
    //   console.log(res)
    //   console.log(res.data.length==0)
    //   if (res.data.length==0){
    //     this.setData({
    //       date:"",
    //     })
    //     wx.showModal({
    //       title:"'课程信息错误'",
    //       content: "请检查课程、导生与时间信息是否匹配",
    //     })
    //   }
    //   console.log(res)
      // this.setData({
      //   status:true,
      //   studentsInfo:res.data[0].studentsInfo
      // })
      // console.log(this.data.studentsInfo)
    // })
    // .catch(err => {
    //   console.log("err")
    // })
  },

  bindTimeChange(e) {
    // console.log(e.detail.value)
    if (this.data.monitorName==""){
      wx.showModal({
        content: '请先填写课程和导生信息',
        showCancel:false
      })
      return
    }

    const pickerType = e.currentTarget.dataset.type
    if(pickerType==='startTime'){
      this.setData({
        startTime :e.detail.value
      })
    }
    if(pickerType==='endTime'){
      this.setData({
        endTime :e.detail.value
      })
    }

    //查询是否有课程可预约
    wx.cloud.database().collection("course")
    .where({
      monitorName:this.data.monitorName,
      date:this.data.date,
      courseName:this.data.courseName
    })
    .get()
    .then(res => {
      console.log(res)
      console.log(res.data.length==0)
      if (res.data.length==0){
        this.setData({
          date:"",
        })
        wx.showModal({
          title:"'课程信息错误'",
          content: "请检查课程、导生与时间信息是否匹配",
        })
      }
      console.log(res)
      this.setData({
        status:true,
        studentsInfo:res.data[0].studentsInfo,
        conNumber:res.data[0].conNumber
      })
      console.log(this.data.studentsInfo)
    })
    .catch(err => {
      console.log("err")
    })
  },

  inputSyllabus(e) {
    this.setData({
      syllabus: e.detail.value
    })
  },
  //实现提交预约按钮，获取预约信息
  submitMsg() {
    if (this.data.status == false){
      console.log("aaaaaaaaaaa")
      wx.showModal({
        // title: '',
        content: '请先完成预约填写',
        showCancel:false
      })
      return
    }

    wx.switchTab({
      url: '../userRecord/userRecord',
    })
    console.log("颠倒")
    wx.cloud.database().collection("appointment")
    .add({
      data:{
        name: this.data.name,
        number: this.data.number,
        major: this.data.major,
        email: this.data.email,
        courseName: this.data.courseName,
        monitorName: this.data.monitorName,
        date: this.data.date,
        syllabus: this.data.syllabus,
        conNumber:this.data.conNumber
      }
    })
    .then(res => {
      console.log("添加成功")
      wx.showToast({
        title: '提交成功',
        duration: 1000, // 控制提示框显示时间，单位毫秒
      });
      
      setTimeout(function () {
        console.log('等一秒');
        wx.navigateBack()
      }, 1000);
    })
    .catch(err => {
      console.log("失败")
    })
    var newObject = {
      name: this.data.name,
      syllabus:this.data.syllabus
    }
    // 创建存入学生信息的数组
    var studentsInfoArray = []
    studentsInfoArray.push(newObject)
    const studentsInfoArrays = studentsInfoArray.concat(this.data.studentsInfo)
    //更新course集合中的课程信息
    wx.cloud.database().collection("course")
    .where({
      courseName:this.data.courseName,
      monitorName:this.data.monitorName,
      date:this.data.date
    })
    .update({
      data:{
        studentsInfo:studentsInfoArrays
      }
    })
    .then(res => {
      console.log(res.data.studentsInfo)
    })
    .catch(err => {
      console.log(err)
    })
  }
})