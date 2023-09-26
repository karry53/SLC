// pages/admiForm/admiForm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mentorName:'',
    cours:'',
    conNumber:'',

    startTime: '08:00',
    endTime: '22:00',


    date:'',

  },
  onLoad(options) {

  },

  onReady() {

  },

  inputMentorName(e) {
    this.setData({
      mentorName: e.detail.value
    })
  },

  inputCourse(e) {
    this.setData({
      course: e.detail.value
    })
  },

  inputConNumber(e) {
    this.setData({
      conNumber: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    console.log(e.currentTarget.dataset.type)
    const pickerType = e.currentTarget.dataset.type
    const newTime = e.detail.value

    //处理不可选的时间段
    const isUnavailableTime = this.isUnavailableTime(newTime)

    //处理时间差
    if(pickerType==='startTime'){
      this.setData({
        startTime :newTime
      })
    }
    if(pickerType==='endTime'){
      this.setData({
        endTime :newTime
      })
    }
    const timeInterval = this.calculateTimeInterval(this.data.startTime,this.data.endTime)

    if(isUnavailableTime){
      wx.showToast({
        title: '12-15点为导生休息时间',
      })
      this.setData({
        startTime : '15:00',
        endTime : '17:00',
      })
    }else if(timeInterval<2){
      wx.showToast({
        title: '最小间隔为两小时',
      })
      const adjustedEndTime = this.calculateAdjustedEndTime(this.data.startTime);
    this.setData({
      endTime: adjustedEndTime,
    });

    }
  },

  //时间段是否不可选
  isUnavailableTime(e){
    console.log(e)
    const hour = parseInt(e.split(':')[0])
    return hour>=12 && hour<=15
  },

  //计算时间差
  calculateTimeInterval(start,end){
    const startTime = start.split(':');
    const endTime = end.split(':');

    let startHour = parseInt(startTime[0]);
    let startMin = parseInt(startTime[1]);

    let endHour = parseInt(endTime[0])
    let endMin = parseInt(endTime[1])

    let hourInterval = endHour - startHour;
    let minInterval = endMin - startMin;

    let timeInterval = hourInterval + minInterval/60;
    return timeInterval
  },

  // 计算自动调整的结束时间（两小时后）
  calculateAdjustedEndTime(startTime) {
  const timeArray = startTime.split(':');
  let hours = parseInt(timeArray[0]);
  let minutes = parseInt(timeArray[1]);

  // 计算结束时间（两小时后）
  hours += 2;
  if (hours >= 24) {
    hours = hours - 24;
  }

  // 格式化时间
  const adjustedEndTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

  return adjustedEndTime;
},

bindDateChange(e){
  console.log(e)
  this.setData({
    date:e.detail.value
  })
},
  submitMsg(e) {
    
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