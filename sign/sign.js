var wisdomJS = require('wisdoms.js')
const AV = require('../../utils/av-weapp-min');
var Todo = AV.Object.extend('Todo');
var username = wx.getStorageSync('username');
var id = wx.getStorageSync('id');
var query = new AV.Query('Todo');
var time, Last, today, W, R
var objectId, yesterday2, rank
var cyh, flag = 0;
var app = getApp();
Page({
  data: {
    userInfo: {},
  },

  //签到
  calendarSign: function () {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var cai = new Date(n);
    var h = cai.getHours();
    var m = cai.getMinutes();
    if ((h == 5 && m >= 30) || (h >= 6 && h <= 7)) {
      this.setData({
        flag: 3
      })
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var n = timestamp * 1000;
      var cai = new Date(n);
      var Y = cai.getFullYear();
      var M = (cai.getMonth() + 1 < 10 ? '0' + (cai.getMonth() + 1) : cai.getMonth() + 1);
      var D = cai.getDate() < 10 ? '0' + cai.getDate() : cai.getDate();
      var h = cai.getHours();
      var m = cai.getMinutes();
      var s = cai.getSeconds();
      var w = cai.getDay();
      var today = new Date();
      var yesterday = new Date(today - 1000 * 60 * 60 * 24);
      var Y1 = yesterday.getFullYear();
      var M1 = (yesterday.getMonth() + 1 < 10 ? '0' + (yesterday.getMonth() + 1) : yesterday.getMonth() + 1);
      var D1 = yesterday.getDate() < 10 ? '0' + yesterday.getDate() : yesterday.getDate();
      yesterday2 = Y1 + '-' + M1 + '-' + D1

      //连续签到
      var query = new AV.Query('Todo');
      var id = wx.getStorageSync('id')
      query.equalTo('id', wx.getStorageSync('id'));
      query.find().then(this.Flag);
    } else if (h >= 8) {
      wx.showModal({
        title: '签到时间已过😱',
        content: '改变自己，从早睡早起开始',
        showCancel: false
      })
    } else {
      wx.showModal({
        content: '太早了，回去再睡一会吧😴',
        showCancel: false
      })
    }
  },

  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    //背景设置
    var src = wx.getStorageSync('src')
    //console.log(src)
    if (!src) {
      src = '../img/bj.jpg'
    }
    this.setData({
      src: src
    })
    //获取头像
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
      })
      that.update()
    })
    //获取当前时间
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var cai = new Date(n);
    var Y = cai.getFullYear();
    var M = (cai.getMonth() + 1 < 10 ? '0' + (cai.getMonth() + 1) : cai.getMonth() + 1);
    var D = cai.getDate() < 10 ? '0' + cai.getDate() : cai.getDate();
    var h = cai.getHours();
    var m = cai.getMinutes();
    var s = cai.getSeconds();
    var w = cai.getDay();
    var week;
    if (w == 0) {
      week = 'Sun'
    }
    if (w == 1) {
      week = 'Mon'
    }
    if (w == 2) {
      week = 'Tue'
    }
    if (w == 3) {
      week = 'Wed'
    }
    if (w == 4) {
      week = 'Thur'
    }
    if (w == 5) {
      week = 'Fri'
    }
    if (w == 6) {
      week = 'Sat'
    }
    this.setData({
      w: week
    })

    if (h / 10 >= 1) {
      this.setData({
        h: h
      })
    } else {
      this.setData({
        h: '0' + h
      })
    }

    if (m / 10 >= 1) {
      this.setData({
        m: m
      })
    } else {
      this.setData({
        m: '0' + m
      })
    }
    var cyh = Y + '/' + M + '/' + D
    this.setData({
      cyh: cyh,
    })

    today = Y + '-' + M + '-' + D

    //建议连接服务器是否正常
    wx.request({
      url: 'https://api.leancloud.cn',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        //console.log('success')
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '无法连接到服务器',
          content: '请检查您的网络设置或稍后再试',
          showCancel: false,
        })
      }
    })
    /*var _this = this
    _this.setData({
      src: '../img/bj.jpg'
    })*/
    console.log(AV.User.current())
    //是否第一次登录
    if (AV.User.current()) {
      var user = AV.User.current();
      //console.log(user)
      var id = user.get('authData').lc_weapp.openid
      wx.setStorageSync("id", id)

      var query = new AV.Query('Todo');
      query.equalTo('id', id);
      query.find().then(this.Begin);
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '请点击首页“获取头像昵称”按钮，允许“早安石大”使用您的用户信息',
      })
    }
  },

  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.onShow();
    wx.stopPullDownRefresh()
  },

  //初始化
  Begin: function (RS) {
    //console.log(RS.length)
    if (RS.length == 0) {
      var id = wx.getStorageSync('id')
      var username = wx.getStorageSync('username');
      var todoFolder = new Todo();
      todoFolder.set('id', id);
      todoFolder.set('username', username);
      todoFolder.save()
    } else {
      var username = RS[0].get('username')
      if (username) {
        username = RS[0].get('username')
        flag = RS[0].get('flag')
        if (flag == 0) {
          var objectId = RS[0].get('objectId')
          var todo = AV.Object.createWithoutData('Todo', objectId);
          todo.set('flag', 1);
          todo.save()
          wx.showModal({
            title: '最新更新',
            content: '1.增加数据分析功能\n2.问题修复和细节优化\n3.祝大家期末考试顺利！',
            showCancel: false
            /*cancelText: '残忍拒绝',
            confirmText: '试一试',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../szsd/szsd',
                })
              } else if (res.cancel) {
              }
            }
            */
          })
        }
      } else {
        var username = wx.getStorageSync('username')
        var objectId = RS[0].get('objectId')
        var todo = AV.Object.createWithoutData('Todo', objectId);
        console.log(username)
        todo.set('username', username);
        todo.save()

        wx.showModal({
          title: '登录失败',
          content: '请点击右上角“…”，点击“关于早安石大”，进入新页面后再点击右上角“…”，点击“设置”，允许“早安石大”使用“我的用户信息”，设置完成后在签到页下拉刷新两次（直到不再弹出提示框）',
          cancelText: '反馈问题',
          confirmText: '我知道了',
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
              wx.navigateTo({
                url: '../feedback/feedback',
              })
            }
          }
        })
      }
    }
    var id = wx.getStorageSync('id')
    var query1 = new AV.Query('Todo');
    query1.equalTo('id', id);
    var query2 = new AV.Query('Todo');
    query2.equalTo('today', today);
    var query = AV.Query.and(query1, query2);
    query.find().then(this.Done);
  },

  Flag: function (RS) {
    objectId = RS[0].get('objectId')
    var todo = AV.Object.createWithoutData('Todo', objectId)
    todo.set('username', username);
    todo.save().then(this.Flag1)
  },
  Flag1: function (RS) {
    //连续签到
    var query = new AV.Query('Todo');
    var id = wx.getStorageSync('id')
    query.equalTo('id', wx.getStorageSync('id'));
    query.find().then(this.Continued);
  },

  //是否连续签到
  Continued: function (RS) {
    //获取当前时间
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var cai = new Date(n);
    console.log(cai)
    var Y = cai.getFullYear();
    var M = (cai.getMonth() + 1 < 10 ? '0' + (cai.getMonth() + 1) : cai.getMonth() + 1);
    var D = cai.getDate() < 10 ? '0' + cai.getDate() : cai.getDate();
    var h = cai.getHours();
    var m = cai.getMinutes();
    var s = cai.getSeconds();
    //获取服务器时间
    var Year = RS[0].get('updatedAt').getFullYear()
    var Month = (RS[0].get('updatedAt').getMonth() + 1 < 10 ? '0' + (RS[0].get('updatedAt').getMonth() + 1) : RS[0].get('updatedAt').getMonth() + 1);
    var Day = RS[0].get('updatedAt').getDate() < 10 ? '0' + RS[0].get('updatedAt').getDate() : RS[0].get('updatedAt').getDate();
    var Hours = RS[0].get('updatedAt').getHours()
    var Minutes = RS[0].get('updatedAt').getMinutes()
    var Seconds = RS[0].get('updatedAt').getSeconds()
    console.log(Y + M + D + ' ' + h + ' ' + m + ' ' + s)
    console.log(Year + Month + Day + ' ' + Hours + ' ' + Minutes + ' ' + Seconds)
    var day1 = Y + M + D
    var day2 = Year + Month + Day
    var now1 = 3600 * h + 60 * m + s
    var now2 = 3600 * Hours + 60 * Minutes + Seconds
    console.log(day1)
    console.log(day2)
    //console.log(now1)
    //console.log(now2)
    console.log(Math.abs(now1 - now2))

    if (Hours < 10 && Minutes < 10) {
      time = '0' + Hours + ':0' + Minutes
    }
    if (Hours < 10 && Minutes >= 10) {
      time = '0' + Hours + ':' + Minutes
    }
    if (Hours >= 10 && Minutes < 10) {
      time = Hours + ':0' + Minutes
    }
    if (Hours >= 10 && Minutes >= 10) {
      time = Hours + ':' + Minutes
    }
    if (Seconds >= 10) {
      time = time + ':' + Seconds
    } else {
      time = time + ':0' + Seconds
    }
    Last = Year + '-' + Month + '-' + Day
    today = Last
    Last = Last + ' ' + time

    if ((day1 == day2) && (Math.abs(now1 - now2) < 300)) {
      //console.log(RS.length)
      objectId = RS[0].get('objectId')
      var total = RS[0].get('total') + 1
      var todo = AV.Object.createWithoutData('Todo', objectId);
      //是否连续签到
      var today1 = RS[0].get('today')
      var continued = RS[0].get('continued')
      var cnt = RS[0].get('cnt' + Month)
      var max = RS[0].get('max')
      var score = RS[0].get('score' + Month)
      //console.log(RS[0].get('score' + Month))
      if (continued == 0) {
        max = 1
      }
      if (yesterday2 == today1) {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        var n = timestamp * 1000;
        var cai = new Date(n);
        var h = cai.getHours();
        var m = cai.getMinutes();
        //console.log('是昨天');
        continued = continued + 1;
        cnt = cnt + 1;
        //积分算法
        if ((h == 5 && m >= 30) || (h == 6 && m < 20)) {
          score += 2
        }
        if (h == 6 && m >= 20) {
          score += 1
        }
        if ((h == 7 && m < 30) || h <= 6) {
          if (cnt >= 1 && cnt <= 5) {
            score += 3;
          }
          if (cnt >= 6 && cnt <= 30) {
            score += 5;
          }
          if (cnt > 30) {
            score += 10;
          }
        }
        if (cnt == 5) {
          score += 15;
        }
        if (cnt == 10) {
          score += 20;
        }
        if (cnt == 20) {
          score += 50;
        }
        if (cnt == 30) {
          score += 100;
        }
        if (cnt > 30 && cnt % 15 == 0) {
          score += 100;
        }

        if (continued >= max) {
          max = continued
        }
        console.log(max)
        todo.set('continued', continued);
      } else {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        var n = timestamp * 1000;
        var cai = new Date(n);
        var h = cai.getHours();
        var m = cai.getMinutes();
        continued = 1
        cnt = 1
        if ((h == 5 && m >= 30) || (h == 6 && m < 20)) {
          score += 2
        }
        if (h == 6 && m >= 20) {
          score += 1
        }
        if ((h == 7 && m < 30) || h <= 6) {
          score += 3
        }
        //console.log('不是昨天');
        todo.set('continued', 1);
      }
      // 修改属性
      var username = wx.getStorageSync('username');
      console.log(score)
      todo.set('max', max);
      todo.set('score' + Month, score);
      todo.set('cnt' + Month, cnt);
      todo.set('Last', Last);
      todo.set('time', time);
      todo.set('today', today);
      todo.set('total', total);
      // 保存到云端
      todo.save().then(this.Wait)
    } else {
      this.setData({
        flag: 2
      })
      wx.showModal({
        title: '签到失败',
        content: '检测到你的系统时间与服务器时间不一致，请打开手机设置检查系统时间是否为中国标准时间（GMT+8），若仍无法正常签到请向开发者反馈',
        cancelText: '反馈问题',
        confirmText: '我知道了',
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
            wx.navigateTo({
              url: '../feedback/feedback',
            })
          }
        }
      })
    }
  },
  //减少出错概率
  Wait: function (RS) {
    /* //排名
     var query = new AV.Query('Todo');
     query.equalTo('today', today);
     query.find().then(this.Rank);*/
    //最近10次
    var query = new AV.Query('Todo');
    var id = wx.getStorageSync('id')
    query.equalTo('id', id);
    query.find().then(this.Ten);
  },
  /*//排名
  Rank: function (RS) {
    console.log(RS.length)
    rank = RS.length
    var query = new AV.Query('Todo');
    var id = wx.getStorageSync('id')
    query.equalTo('id', id);
    query.find().then(this.Rank1);
  },
  Rank1: function (RS) {
    var todo = AV.Object.createWithoutData('Todo', objectId);
    todo.set('rank', rank);
    todo.save();
  },*/
  //最近10次
  Ten: function (RS) {
    //console.log(RS.length)
    var todo = AV.Object.createWithoutData('Todo', objectId);
    // 修改属性
    for (var i = 4; i > 0; i--) {
      var continued = 'w' + i.toString()
      var cnt11 = 'w' + (i - 1).toString()
      var cnt2 = 'r' + i.toString()
      var cnt22 = 'r' + (i - 1).toString()
      var w1 = RS[0].get(cnt11)
      var r1 = RS[0].get(cnt22)
      todo.set(continued, w1)
      todo.set(cnt2, r1)
    }
    todo.set('w0', Last)
    // 保存到云端
    todo.save();
    var query = new AV.Query('Todo');
    query.equalTo('today', today);
    query.limit(200)
    query.find().then(this.TenRank);
  },

  TenRank: function (RS) {
    var length = RS.length
    var todo = AV.Object.createWithoutData('Todo', objectId);
    todo.set('rank', length)
    todo.set('r0', length)
    todo.save();

    this.setData({
      flag: 1
    })

    var rnd = parseInt((Math.random() * wisdomJS.wisdoms.length))
    var wisdom = wisdomJS.wisdoms[rnd]['w']
    console.log(wisdom)

    wx.showModal({
      title: '签到成功',
      content: wisdom,
      showCancel: false,
      success: function () {
        wx.switchTab({
          url: '../rank/rank',
        })
      }
    })
  },

  //判断今天是否已经打卡
  Done: function (RS) {
    if (RS.length == 0) {
      flag = 2
      this.setData({
        flag: 2
      })
    } else {
      flag = 1
      this.setData({
        flag: 1
      })
    }
  },

  calendarSignDone: function () {
    wx.switchTab({
      url: '../rank/rank'
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      title: '快来和我一起签到！',
      path: 'pages/sign/sign',
      success: function (res) {
        //console.log('分享成功')
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  Money: function (e) {
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?accountId=1966705',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    var that = this;
    this.onShow();
  },
})