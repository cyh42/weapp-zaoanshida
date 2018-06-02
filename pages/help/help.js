const AV = require('../../utils/av-weapp-min');
Page({
  data: {
    list: [{
      open: false,
    }],
    list1: [{
      open: false,
    }],
    list2: [{
      open: false,
    }],
    list3: [{
      open: false,
    }],
  },

  widgetsToggle: function (e) {
    var list = this.data.list;
    list[0].open = !list[0].open;
    //console.log(list[0].open)
    this.setData({
      list: list
    });
  },

  widgetsToggle1: function (e) {
    var list1 = this.data.list1;
    list1[0].open = !list1[0].open;
    this.setData({
      list1: list1
    });
  },

  widgetsToggle2: function (e) {
    var list2 = this.data.list2;
    list2[0].open = !list2[0].open;
    this.setData({
      list2: list2
    });
  },

  widgetsToggle3: function (e) {
    var list3 = this.data.list3;
    list3[0].open = !list3[0].open;
    this.setData({
      list3: list3
    });
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})