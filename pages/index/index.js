// index.js
Page({
  data:{

  },

  navigateToUserForm(){
    wx.navigateTo({
      url: '../userForm/userFrom',
    })
  },

  switchTabUserRecord(){
    wx.switchTab({
      url: '../userRecord/userRecord',
    })
  }
})
