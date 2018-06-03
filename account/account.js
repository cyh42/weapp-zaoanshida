const AV = require('../../utils/av-weapp-min');
var Todo = AV.Object.extend('Todo');
var query = new AV.Query('Todo');
var name, zy
var app = getApp()
Page({
  data: {
    multiArray: [['地球科学与技术学院', '石油工程学院', '化学工程学院', '机电工程学院', '信息与控制工程学院', '储运与建筑工程学院', '计算机与通信工程学院', '经济管理学院', '理学院', '文学院'], ['机自', '安全', '材控', '材料', '车辆', '工业', '机械'], ['2017', '2016', '2015', '2014']],
    multiIndex: [3, 0, 0],
    inputShowed: false,
    inputVal: "",
    name: '',
  },

  // 获取输入账号 
  Input: function (e) {
    var user = AV.User.current();
    console.log(user.get('authData').lc_weapp.openid)
    var id = user.get('authData').lc_weapp.openid
    wx.setStorageSync("id",id)

    var query = new AV.Query('Todo');
    query.equalTo('id', id);
    query.find().then(this.ItemTraverse1);

    this.setData({
      name: e.detail.value
    })
    name = e.detail.value
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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
    this.setData({
      hidden1: false,
      picker: "请选择专业年级"
    })
  },

  ItemTraverse1: function (RS) {
    if (!RS.length) {
      var TodoFolderFolder = new Todo();
      var id = wx.getStorageSync('id')
      var username = wx.getStorageSync('username')
      TodoFolderFolder.set('id', id);
      TodoFolderFolder.set('username', username);
      TodoFolderFolder.save()
    }
  },

  // 绑定账号 
  login: function () {
    var user = AV.User.current();
    console.log(user.get('authData').lc_weapp.openid)
    var id = user.get('authData').lc_weapp.openid
    wx.setStorageSync("id", id)
    
    if (zy == null) {
      wx.showModal({
        content: '请选择专业年级',
        showCancel: false
      })
    }
    if (this.data.name.length == 0) {
      wx.showModal({
        content: '必须得有个名字吧，😜',
        showCancel: false
      })
    }
    if (this.data.name.length != 0 && zy) {
      var query = new AV.Query('Todo');
      query = new AV.Query('Todo');
      var id = wx.getStorageSync("id")
      query.equalTo('id', id);
      query.find().then(this.ItemTraverse);

      wx.showModal({
        content: '绑定成功~',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../sign/sign',
            })
          }
        }
      })
    }
  },

  ItemTraverse: function (RS) {
    var username = wx.getStorageSync('username')
    var objectId = RS[0].get('objectId')
    var Todo = AV.Object.createWithoutData('Todo', objectId);
    Todo.set('username', username);
    Todo.set('zy', zy);
    Todo.set('name', name);
    Todo.save();
  },

  bindMultiPickerChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      multiIndex: e.detail.value,
      picker: "当前选择：" + this.data.multiArray[1][this.data.multiIndex[1]] + this.data.multiArray[2][this.data.multiIndex[2]]
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['资源勘查', '勘查技术', '测绘', '地信', '地质', '地球物理'];
            data.multiArray[2] = ['2017', '2016', '2015', '2014'];
            break;
          case 1:
            data.multiArray[1] = ['石工', '船舶', '海油'];
            data.multiArray[2] = ['2017', '2016', '2015', '2014'];
            break;
          case 2:
            data.multiArray[1] = ['化工', '装控', '应化', '环境', '环设'];
            data.multiArray[2] = ['2017', '2016', '2015', '2014'];
            break;
          case 3:
            data.multiArray[1] = ['机自', '安全', '材控', '材料', '车辆', '工业', '机械'];
            data.multiArray[2] = ['2017', '2016', '2015', '2014'];
            break;
          case 4:
            data.multiArray[1] = ['自动化', '电子信息', '电气', '测控'];
            data.multiArray[2] = ['2017', '2016', '2015', '2014'];
            break;
          case 5:
            data.multiArray[1] = ['油气储运', '能动', '土木', '工程力学', '建环', '建筑'];
            data.multiArray[2] = ['2017', '2016', '2015', '2014'];
            break;
            break;
          case 6:
            data.multiArray[1] = ['计算机', '软件', '通信', '物联网'];
            data.multiArray[2] = ['2017', '2016', '2015', '2014'];
            break;
          case 7:
            data.multiArray[1] = ['工程管理', '会计', '财务', '市场营销', '经济学', '国贸', '行政'];
            data.multiArray[2] = ['2017', '2016', '2015', '2014'];
            break;
          case 8:
            data.multiArray[1] = ['数学', '应用物理', '光电', '材料物理', '材料化学', '化学'];
            data.multiArray[2] = ['2017', '2016', '2015', '2014'];
            break;
          case 9:
            data.multiArray[1] = ['英语', '俄语', '法学', '汉语言', '音乐'];
            data.multiArray[2] = ['2017', '2016', '2015', '2014'];
            break;
            
        }
        
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['2017', '2016', '2015', '2014'];
                break;
              case 1:
                data.multiArray[2] = ['2017', '2016', '2015', '2014'];
                break;
              case 2:
                data.multiArray[2] = ['2017', '2016', '2015', '2014'];
                break;
              case 3:
                data.multiArray[2] = ['2017', '2016', '2015', '2014'];
                break;
              case 4:
                data.multiArray[2] = ['2017', '2016', '2015', '2014'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['2017', '2016', '2015', '2014'];
                break;
              case 1:
                data.multiArray[2] = ['2017', '2016', '2015', '2014'];
                break;
              case 2:
                data.multiArray[2] = ['2017', '2016', '2015', '2014'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
    zy = this.data.multiArray[1][this.data.multiIndex[1]] + this.data.multiArray[2][this.data.multiIndex[2]]
    this.setData({
      picker: "当前选择：" + this.data.multiArray[1][this.data.multiIndex[1]] + this.data.multiArray[2][this.data.multiIndex[2]]
    })   
  },

  solve: function (e) {
    wx.showModal({
      title: '解决方法',
      content: '请点击右上角“…”，点击“关于早安石大”，进入新页面后再点击右上角“…”，点击“设置”，允许“早安石大”使用“我的用户信息”',
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
  },

  try: function () {
    wx.switchTab({
      url: '../sign/sign',
    })
  }
})