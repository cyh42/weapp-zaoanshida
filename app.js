//app.js
const updateManager = wx.getUpdateManager();
const AV = require('./utils/av-weapp-min');
AV.init({
  appId: 'wDFncj3wQhh6pIfeRqEy2RkH-gzGzoHsz',
  appKey: 'hNAAvzdOk1P1QqbLA7zVvJ9B',
});
const Realtime = require('./libs/realtime.weapp.min.js').Realtime;
const realtime = new Realtime({
  appId: 'wDFncj3wQhh6pIfeRqEy2RkH-gzGzoHsz',
  appKey: '',
});
const user = AV.User.current();
var username

App({
  onLaunch: function () {
    AV.User.loginWithWeapp().then(user => {
      this.globalData.user = user.toJSON();
    }).catch(console.error);

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
              username = that.globalData.userInfo.nickName
              wx.setStorageSync('username', that.globalData.userInfo.nickName)
            }
          })
        }
      });
    }
  },

  globalData: {
    userInfo: null
  }
})