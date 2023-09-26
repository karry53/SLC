// pages/administrator/administrator.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherActive: true, 
  },

  switchToTeacher() {
    // 切换到教师端登录
    this.setData({
      teacherActive: true,
    });
  },

  switchToStudent() {
    // 切换到导生端登录
    this.setData({
      teacherActive: false,
    });
  },
 
  submitLogin() {
    const { loginMsg, teacherActive } = this.data;

    if (teacherActive) {
      this.submitToTeacherServer(loginMsg);
    } else {
      this.submitToMentorServer(loginMsg);
    }
  },

  submitToTeacherServer(formData){
    console.log('teacher')

  },

  submitToMentorServer(formData){
    console.log('mentor')
  },

  onLoad(options) {

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

  }
})