// pages/userRecord/userRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _openid: "",
    userRecord: [],
    appointment_id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取用户_openid
    wx.cloud.callFunction({
        name: "getOpenId"
      })
      .then(res => {
        console.log(res.result.openid)
        this.setData({
          _openid: res.result.openid
        })
      })
      .catch(err => {
        console.log(err)
      })
    wx.cloud.database().collection("appointment")
      .orderBy("date", "desc")
      .where({
        _openid: this.data.openid
      })
      .get()
      .then(res => {
        console.log('id',res)
        this.setData({
          userRecord: res.data
        })

      })
      .catch(err => {
        console.log(err)
      })



    // wx.cloud.database().collection("appointment")
    //   .orderBy("date", "desc")
    //   .where({
    //     _openid: this.data._openid
    //   })
    //   .get()
    //   .then(res => {
    //     this.setData({
    //       userRecord: res.data
    //     });

        // 获取 userRecord 中的每个元素的 conNumber
        // const promises = res.data.map(item => {
        //   return wx.cloud.database().collection("course")
        //     .where({
        //       conNumber: item.monitorName, // 以 monitorName 为条件查询
        //       courseName: item.courseName // 以 courseName 为条件查询
        //     })
        //     .get()
        //     .then(courseRes => {
        //       if (courseRes.data.length > 0) {
        //         // 如果找到匹配的记录，则将 conNumber 存入 userRecord 中的对应元素
        //         item.conNumber = courseRes.data[0].conNumber;
        //         console.log('kaobei',item.conNumber)
        //       }
        //       return item;
        //     });
        // });

      //   console.log('hahhah',promises)

      //   // 使用 Promise.all 来等待所有数据库查询完成
      //   return Promise.all(promises);
      // })
      // .then(updatedUserRecord => {
      //   // 更新页面数据
      //   this.setData({
      //     userRecord: updatedUserRecord
      //   });

      //   console.log("Updated userRecord:", this.data.userRecord);
      // })
      // .catch(err => {
      //   console.error(err);
      // });
  },


  cancelAppointment(e) {
    var that = this
    console.log(e.currentTarget.dataset._id)
    this.setData({
      appointment_id: e.currentTarget.dataset._id
    })
    wx.showModal({
        title: '是否确定取消预约',
        // content: 'shishi',
        confirmColor: "#DC143C"
      })
      .then(res => {
        console.log(res)
        if (res.confirm) {
          console.log("确定取消预约")
          wx.cloud.database().collection("appointment")
            .where({
              _id: this.data.appointment_id
            })
            .remove()
            .then(res => {
              console.log("删除成功")
              console.log(that)
              that.onLoad()
            })
            .catch(err => {
              console.log("删除失败")
            })
        } else {
          console.log("取消操作")
        }
      })
      .catch(err => {
        console.log(err)
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

  }
})