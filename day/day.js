var util = require('../../utils/util.js');
const AV = require('../../utils/av-weapp-min');
var id = wx.getStorageSync('id')
var app = getApp()
Page({
  data: {
    list: [{
      open: false,
    }],
    list1: [{
      open: false,
    }],
    list2: [{
      open: true,
    }],
  },

  onPullDownRefresh: function () {
    var that = this;
    that.onShow();
    wx.stopPullDownRefresh()
  },

  ItemTraverse: function (RS) {
    //console.log(RS.length)
    let taskListme = []
    for (var i = 0; i < 5; i++) {
      var w = 'w' + i.toString()
      var r = 'r' + i.toString()
      if (RS[0].get(w) || RS[0].get(r)) {
        var rank = RS[0].get(r)
        if (rank == 1) {
          rank = '🥇' + 'No.' + rank
        } else if (rank == 2) {
          rank = '🥈' + 'No.' + rank
        } else if (rank == 3) {
          rank = '🥉' + 'No.' + rank
        } else {
          rank = 'No.' + rank
        }
        taskListme.push({
          time: RS[0].get(w),
          rank: rank,
        });
      }
    }
    this.setData({
      taskListme: taskListme
    });
    //console.log(taskListme)
  },

  ItemTraverse1: function (RS) {
    //console.log(RS)
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var cai = new Date(n);
    var M = (cai.getMonth() + 1 < 10 ? '0' + (cai.getMonth() + 1) : cai.getMonth() + 1);

    var total = RS[0].get('total')
    var continued = RS[0].get('continued')
    var max = RS[0].get('max')
    var score = RS[0].get('score' + M)
    var self1 = RS[0].get('name')
    var self2 = RS[0].get('zy')

    if (self1 && self2) {
      self = RS[0].get('zy') + '-' + RS[0].get('name')
    } else {
      self = "请点击右侧设置绑定"
    }
    //奖励头衔
    var img
    if (continued < 3) {
      img = '1'
    } else if (continued < 5) {
      img = '2'
    } else if (continued < 7) {
      img = '3'
    } else if (continued < 14) {
      img = '4'
    } else if (continued < 30) {
      img = '5'
    } else if (continued < 90) {
      img = '6'
    } else if (continued < 180) {
      img = '7'
    } else {
      img = '8'
    }
    this.setData({
      max: max,
      score: score,
      continued: continued,
      total: total,
      self: self,
      img: '../images/lv' + img + '.png'
    })
  },


  widgetsToggle: function (e) {
    wx.request({
      url: 'https://api.leancloud.cn',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log('success')
      },
      fail: function (res) {
        wx.showModal({
          title: '无法连接到服务器',
          content: '请检查您的网络设置或稍后再试',
          showCancel: false,
        })
      }
    })
    var id = wx.getStorageSync('id')
    var query = new AV.Query('Todo');
    query.equalTo('id', id);
    query.find().then(this.ItemTraverse);

    var list = this.data.list;
    //console.log(list[0].open)
    list[0].open = !list[0].open;
    //console.log(list[0].open)

    this.setData({
      list: list
    });
  },

  widgetsToggle1: function (e) {
    var list1 = this.data.list1;
    //console.log(list1[0].open)
    list1[0].open = !list1[0].open;
    //console.log(list1[0].open)
    this.setData({
      list1: list1
    });
  },

  widgetsToggle2: function (e) {
    var list2 = this.data.list2;
    this.setData({
      list21: list2
    });
  },

  onShow: function () {
    //背景设置
    var src = wx.getStorageSync('src')
    //console.log(src)
    if (!src) {
      src = '../img/bj.jpg'
    }
    this.setData({
      src: src
    })

    wx.request({
      url: 'https://api.leancloud.cn',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log('success')
      },
      fail: function (res) {
        wx.showModal({
          title: '无法连接到服务器',
          content: '请检查您的网络设置或稍后再试',
          showCancel: false,
        })
      }
    })

    var query = new AV.Query('Todo');
    var id = wx.getStorageSync('id')
    query.equalTo('id', id);
    query.find().then(this.ItemTraverse1);
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      //console.log(userInfo)
      that.setData({
        userInfo: userInfo,
      })
      that.update()
    })

    var query = new AV.Query('Todo');
    var id = wx.getStorageSync('id')
    query.equalTo('id', id);
    query.find().then(this.ItemTraverse);
  },

  turn: function () {
    wx.navigateTo({
      url: '../account/account',
    })
  },

  setting: function () {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },

  team: function () {
    wx.showModal({
      title: 'demon军团',
      content: '卢秋意 中国政法大学 商学院\n蔡宇航 中国石油大学（华东） 机电工程学院\n刘寅新 太原理工大学 软件学院',
      showCancel: false
    })
  },

  about: function () {
    wx.showModal({
      title: '早安石大 v2.3.0',
      content: '本小程序基于LeanCloud搭建，祝大家使用愉快！',
      showCancel: false
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '快来和我一起签到！',
      path: 'pages/day/day',
      success: function (res) {
        //console.log('分享成功')
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  Beijing: function (e) {
    var _this = this;
    wx.showActionSheet({
      itemList: ['自定义', '默认1（清晨）', '默认2（跑步）', '默认3'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              wx.saveFile({
                tempFilePath: tempFilePaths[0],
                success: function (res) {
                  var savedFilePath = res.savedFilePath
                  console.log(savedFilePath)
                  wx.setStorageSync('src', savedFilePath)
                  console.log(savedFilePath)
                  _this.setData({
                    src: savedFilePath
                  })
                  wx.showToast({
                    title: '设置成功',
                    icon: 'success',
                  })
                }
              })
            }
          })
        }
        if (res.tapIndex == 1) {
          wx.setStorageSync('src', 'https://upload-images.jianshu.io/upload_images/11392274-858aea8c30cc60c8.jpg')
          _this.setData({
            src: 'https://upload-images.jianshu.io/upload_images/11392274-858aea8c30cc60c8.jpg'
          })
          wx.showToast({
            title: '设置成功',
            icon: 'success',
          })
        }
        if (res.tapIndex == 2) {
          wx.setStorageSync('src', 'https://upload-images.jianshu.io/upload_images/11392274-46f04c0ad8a9ee69.jpg')
          _this.setData({
            src: 'https://upload-images.jianshu.io/upload_images/11392274-46f04c0ad8a9ee69.jpg'
          })
          wx.showToast({
            title: '设置成功',
            icon: 'success',
          })
        }
        if (res.tapIndex == 3) {
          wx.setStorageSync('src', '../img/bj.jpg')
          _this.setData({
            src: '../img/bj.jpg'
          })
          wx.showToast({
            title: '设置成功',
            icon: 'success',
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  feedback: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  help: function () {
    wx.navigateTo({
      url: '../help/help',
    })
  },

  photo: function () {
    wx.navigateTo({
      url: '../photo/photo',
    })
  },

  library: function () {
    wx.navigateTo({
      url: '../library/library',
    })
  },

  classroom: function() {
    wx.navigateTo({
      url: '../classroom/classroom',
    })
  },

  zan: function () {
    wx.showActionSheet({
      itemList: ['保存小程序码到相册'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.getImageInfo({
            src: '../images/wx.jpg',
            success: function (ret) {
              console.log(ret)
              var path = ret.path;
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success(result) {
                  wx.showToast({
                    title: '已保存到系统相册',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
            }
          })
        }
        if (res.tapIndex == 1) {
          var that = this
          that.onShareAppMessage
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
})