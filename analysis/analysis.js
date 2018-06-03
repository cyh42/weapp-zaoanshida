var app = getApp()
var varName;
var ctx = wx.createCanvasContext('canvasArcCir');
var util = require('../../utils/util.js');
const AV = require('../../utils/av-weapp-min');
var id = wx.getStorageSync('id'), cha = 100, total = 0;

Page({
  data: {
    hiddenmodalput: true,
  },
  drawCircle: function () {
    function drawArc(s, e) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, 200, 200);
      ctx.draw();
      var x = 100, y = 100, radius = 96;
      ctx.setLineWidth(5);
      ctx.setStrokeStyle('#d81e06');
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, radius, s, e, false);
      ctx.stroke()
      ctx.draw()
    }
    var p = total / cha
    var q = parseInt(100 * p)
    console.log(q)
    var startAngle = -0.5 * Math.PI, endAngle = 0;
    endAngle = 2 * p * Math.PI + startAngle;
    console.log(startAngle)
    drawArc(startAngle, endAngle);
    this.setData({
      q: q
    })
  },
  onReady: function () {
    //创建并返回绘图上下文context对象。
    var cxt_arc = wx.createCanvasContext('canvasCircle');
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#eaeaea');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(100, 100, 96, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.draw();
  },

  onShow: function (options) {
    var query = new AV.Query('Todo');
    var id = wx.getStorageSync('id')
    query.equalTo('id', id);
    query.find().then(this.ItemTraverse1);
  },

  ItemTraverse1: function (RS) {
    total = RS[0].get('total')
    var continued = RS[0].get('continued')
    var max = RS[0].get('max')
    var createdAt = RS[0].get('createdAt')
    console.log(createdAt)
    var day1 = createdAt;
    var day2 = new Date();
    console.log(day2)
    cha = parseInt((day2 - day1 + 1) / (1000 * 60 * 60 * 24));
    this.setData({
      done: total,
      begin: cha,
      undone: cha - total,
      cnt: continued,
      max: max,
    })
    var that = this
    that.drawCircle()
  },
})