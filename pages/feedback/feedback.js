const AV = require('../../utils/av-weapp-min');
var username,phone,mode,score
var app = getApp()
var key = wx.getStorageSync('key')

Page({
  data: {
    array: ['QQ', '手机', '微信'],
    index: 0
  },

  slider4change: function (e) {
    console.log(e.detail.value);
    score = e.detail.value
  },

  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
    phone = e.detail.value
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    mode = this.data.array[e.detail.value]
  },

  // 获取输入内容
  listenerTextarea: function (e) {
    console.log(key)

    this.setData({
      username: e.detail.value
    })
    username = e.detail.value
  },

  onShow: function () {
    wx.request({
      url: 'https://api.leancloud.cn',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('success')
      },
      fail: function (res) {
        wx.showModal({
          title: '无法连接到服务器',
          content: '请检查您的网络设置或稍后再试',
          showCancel: false,
        })
      }
    })
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      that.update()
    })
  },

  // 提交
  submit: function () {
    if (username || score) {
      if (mode == null) {
        mode = 'QQ'
      }
      var id = mode + ':' + phone
      var Todo = AV.Object.extend('feedback');
      // 新建一个 Todo 对象
      var todo = new Todo();
      todo.set('username', key);
      todo.set('id', id);
      todo.set('score', score);
      todo.set('content', username);
      todo.save().then(function (todo) {
        // 成功保存之后，执行其他逻辑.
        console.log('New object created with objectId: ' + todo.id);
      }, function (error) {
        // 异常处理
        console.error('Failed to create new object, with error message: ' + error.message);
      });

      wx.showModal({
        title: '反馈成功！',
        content: '您的意见是我们前进的最大动力，对您的配合和支持表示衷心感谢！',
        showCancel: false,
      })
    } else {
      wx.showModal({
        title: '提交失败~',
        content: '评论和打分请至少填写一项',
        showCancel: false
      })
    }
  },

  qq: function () {
    wx.setClipboardData({
      data: '931282603',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
            wx.showToast({
              title: 'QQ号复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },

  wechat: function () {
    wx.setClipboardData({
      data: '18258699338',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
            wx.showToast({
              title: '微信复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },

  github: function () {
    wx.setClipboardData({
      data: 'https://github.com/cyh42',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
            wx.showToast({
              title: '已复制链接',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },

  /*phone: function () {
    wx.addPhoneContact({
      photoFilePath: '../images/I.jpeg',
      firstName: '宇航',
      lastName: '蔡',
      mobilePhoneNumber: '18258699338',
      addressState: '山东省',
      addressCity: '青岛市',
      url: 'https://github.com/cyh42',
      organization: '中国石油大学',
      addressPostalCode: '266580',
      email: 'cyh42@outlook.com'
    })
  }*/

  phone: function () {
    wx.makePhoneCall({
      phoneNumber: '18258699338',
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  
})