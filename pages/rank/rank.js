var app = getApp()
var util = require('../../utils/util.js');
var rank, content, rank1
var id = wx.getStorageSync('id')
const AV = require('../../utils/av-weapp-min');
var query = new AV.Query('Todo');
Page({
  data: {
    navbar: ['今日排行', '月积分榜'],
    currentTab: 0,
    boolean: true,
    student: null,
    hidden: false,
    taskList: [],
    taskList1: [],
    task: '',
    tipsHidden: true,
    list: [{
      open: true,
    }],
    list1: [{
      open: true,
    }]
  },
  //响应点击导航栏
  navbarTap: function (e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
      TypeItem: that.data.navbar[that.data.currentTab]
    })
  },

  onPullDownRefresh: function () {
    var that = this;
    that.onShow();
    wx.stopPullDownRefresh()
  },
  //排名列表
  List: function (RS) {
    console.log(RS)
    let taskList = []
    for (var i = 0; i < RS.length; i++) {
      //var rank = RS[i].get('rank')
      var rank = i + 1
      if (rank == 1) {
        rank = '🥇' + 'No.' + rank
      } else if (rank == 2) {
        rank = '🥈' + 'No.' + rank
      } else if (rank == 3) {
        rank = '🥉' + 'No.' + rank
      } else {
        rank = '  No.' + rank
      }
      taskList.push({
        rank: rank,
        username: RS[i].get('username'),
        time: RS[i].get('time'),
      });
    }
    this.setData({
      taskList: taskList
    });

    //console.log(taskList)
    //获取当前时间
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var cai = new Date(n);
    var Y = cai.getFullYear();
    var M = (cai.getMonth() + 1 < 10 ? '0' + (cai.getMonth() + 1) : cai.getMonth() + 1);
    var D = cai.getDate() < 10 ? '0' + cai.getDate() : cai.getDate();
    var today = Y + '-' + M + '-' + D
    var query1 = new AV.Query('Todo');
    var query2 = new AV.Query('Todo');
    var id = wx.getStorageSync('id')
    query1.equalTo('id', id);
    query2.equalTo('today', today);
    var query3 = AV.Query.and(query1, query2);
    query3.find().then(this.myItem);
  },

  myItem: function (RS) {
    //个人积分
    var id = wx.getStorageSync('id')
    var query = new AV.Query('Todo');
    query.equalTo('id', id);
    query.find().then(this.Score);

    //console.log(RS.length)
    if (!RS.length) {
      this.setData({
        boolean: false,
        yzm: '尚未签到\n(点击前往)'
      });
    } else {
      rank = RS[RS.length - 1].get('rank')
      rank1 = rank
      if (rank == 1) {
        rank = '🥇' + 'No.' + rank
      } else if (rank == 2) {
        rank = '🥈' + 'No.' + rank
      } else if (rank == 3) {
        rank = '🥉' + 'No.' + rank
      } else {
        rank = 'No.' + rank
      }
      this.setData({
        boolean: true,
        rank: rank,
        time: RS[RS.length - 1].get('time'),
      });
    }
  },
  //个人积分
  Score: function (results) {
    //检测是否绑定
    var name = results[0].get('name')
    //console.log(results[0].get('name'))
    console.log(name)
    if (!name) {
      wx.showModal({
        title: '温馨提示',
        content: '您暂未绑定专业和姓名，将无法获得相关奖品，是否前往绑定？',
        cancelText: '还是算了',
        confirmText: '前往绑定',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../account/account',
            })
          } else if (res.cancel) {
          }
        }
      })
    }

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var cai = new Date(n);
    var M = (cai.getMonth() + 1 < 10 ? '0' + (cai.getMonth() + 1) : cai.getMonth() + 1);
    //console.log(results[0].get('score'))
    var score = results[0].get('score' + M)
    this.setData({
      score: score
    })
  },
  onShow: function () {
    //背景设置
    var src = wx.getStorageSync('src')
    if (!src) {
      src = '../img/bj.jpg'
    }
    this.setData({
      src: src
    })
    wx.showLoading({
      title: '加载中',
    })
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
    //个人信息
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
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
    var today = Y + '-' + M + '-' + D
    //按时间，升序排列
    query.ascending('Last');
    query.equalTo('today', today);
    query.limit(200)
    query.find().then(this.List);
    //积分榜
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var cai = new Date(n);
    var M = (cai.getMonth() + 1 < 10 ? '0' + (cai.getMonth() + 1) : cai.getMonth() + 1);
    var score = new AV.Query('Todo');
    score.descending('score' + M);
    score.notEqualTo('score' + M, 0);
    score.find().then(this.ScoreRank);
  },
  //积分榜
  ScoreRank: function (RS) {
    console.log(RS.length)
    if (RS.length) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var n = timestamp * 1000;
      var cai = new Date(n);
      var M = (cai.getMonth() + 1 < 10 ? '0' + (cai.getMonth() + 1) : cai.getMonth() + 1);
      var taskList1 = [], rank1 = 1
      //console.log('score' + M)
      var scoremin = RS[0].get('score' + M), rank
      for (var i = 0; i < RS.length; i++) {
        var score = RS[i].get('score' + M)
        if (score) {
          if (score < scoremin) {
            rank1 = i + 1;
            scoremin = score
          }
          if (rank1 == 1) {
            rank = '🥇' + 'No.' + rank1
          } else if (rank1 == 2) {
            rank = '🥈' + 'No.' + rank1
          } else if (rank1 == 3) {
            rank = '🥉' + 'No.' + rank1
          } else {
            rank = 'No.' + rank1
          }
          taskList1.push({
            rank: rank,
            username: RS[i].get('username'),
            score: score,
          });
        }
      }
      this.setData({
        taskList1: taskList1
      });
    }
  },

  getYzm: function () {
    wx.switchTab({
      url: '../sign/sign',
    })
  },

  onShareAppMessage: function (res) {
    if (rank1) {
      content = '我今天第' + rank1 + '个签到，'
    } else {
      content = ''
    }
    content = content + '快来和我一起签到！'
    console.log(rank1)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: content,
      path: 'pages/rank/rank',
      success: function (res) {
        //console.log('分享成功')
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  Rule: function (e) {
    wx.navigateTo({
      url: '../help/help',
    })
  }
})