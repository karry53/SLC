// 注册页面 register.js
const app = getApp();

Page({
  data: {
    username: '',
    password: ''
  },
  // 处理用户名输入
  handleUsernameInput(e) {
    this.setData({
      username: e.detail.value
    });
  },
  // 处理密码输入
  handlePasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },
  
  handleRegister() {
    wx.switchTab({
      url: '../administrator/administrator',
    })

    wx.cloud.database().collection('monitor')

    .add({
      data: {
        mentorAccount:this.data.username,
        mentorPassword:this.data.password
      }
    })
      .then(res => {
        // 注册成功后的处理
        console.log('注册成功', res);
        
      })
      .catch(err => {
        // 注册失败处理
        console.error('注册失败', err);
        // 提示用户注册失败
      });
  }
});
