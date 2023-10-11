// pages/administrator/administrator.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherActive: true, 

    teacherAccount:'111',
    teacherPassword:'111',

    mentorAccount:'',
    mentorPassword:''
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
 
  submitLogin(e) {
    console.log('为什么'.e)
    const { loginMsg, teacherActive } = this.data;

    if (teacherActive) {
      this.submitToTeacherServer(e);
    } else {
      this.submitToMentorServer(e);
    }
  },

  submitToTeacherServer(e){
    console.log('teacher',e)
    var teacherAccount = e.detail.value.account;
    var teacherPassword = e.detail.value.password;

    console.log(teacherAccount)
    console.log(teacherPassword)

    if (teacherAccount === this.data.teacherAccount && teacherPassword === this.data.teacherPassword) {
      wx.navigateTo({
        url: '../admTeaChoices/admTeaChoices',
      });
    } else {
      // 显示错误提示或其他处理
      wx.showToast({
        title: '账号或密码错误',
        icon: 'none',
        duration: 2000
      });
    }


  },

  submitToMentorServer(e){
    console.log('mentor',e)

    var mentorAccount = e.detail.value.account;
    var mentorPassword = e.detail.value.password;

    // const { username, password } = this.data;

    // 查询数据库集合 "monitor" 中是否存在匹配的用户名和密码
    const db = wx.cloud.database();
    const monitorCollection = db.collection('monitor');

    monitorCollection.where({
      mentorAccount,
      mentorPassword
    }).get()
      .then(res => {
        if (res.data.length > 0) {
          // 登录成功后的处理
          console.log('登录成功', res.data[0]);
          wx.navigateTo({
            url: '../admMenRecord/admMenRecord',
          })
        } else {
          wx.showToast({
                  title: '账号或密码错误',
                  icon: 'none',
                  duration: 2000
                });
        }
      })
      .catch(err => {
        // 处理错误
        console.error('登录失败', err);
        // 提示用户登录失败
      });

  //   if (mentorAccount === this.data.mentorAccount && mentorPassword === this.data.mentorPassword) {
  //     wx.navigateTo({
  //       url: '../admMenRecord/admMenRecord?mentorAccount=' + mentorAccount,
  //     });
  //   } else {
  //     // 显示错误提示或其他处理
  //     wx.showToast({
  //       title: '账号或密码错误',
  //       icon: 'none',
  //       duration: 2000
  //     });
  // }
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