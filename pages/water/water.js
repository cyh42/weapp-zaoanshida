var app = getApp()
var done = parseInt(0), ml = parseInt(0);
var interval;
var varName;
var ctx = wx.createCanvasContext('canvasArcCir');

Page({
  data: {
    hiddenmodalput: true,
    done: 0,
  },
  drawCircle: function () {
    clearInterval(varName);
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
    done = parseInt(done) + parseInt(ml)
    console.log(done)
    var p = done / 2000
    console.log(p)
    var step = 1, startAngle = -0.5 * Math.PI, endAngle = 0;
    endAngle = 2 * p * Math.PI + startAngle;
    console.log(startAngle)
    drawArc(startAngle, endAngle);
    step++;
    this.setData({
      done: done
    })
    wx.setStorageSync('water', done)
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
  onLoad: function (options) {
    clearInterval(varName);
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
    if (wx.getStorageSync('water')) {
      done = wx.getStorageSync('water')
    } else {
      done = 0
    }
    console.log(done)
    var p = done / 2000
    console.log(p)
    var step = 1, startAngle = -0.5 * Math.PI, endAngle = 0;
    endAngle = 2 * p * Math.PI + startAngle;
    console.log(startAngle)
    drawArc(startAngle, endAngle);
    step++;
    this.setData({
      done: done
    })
  },
  modalinput: function (e) {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function (e) {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function (e) {
    var that = this;
    that.drawCircle();
    this.setData({
      hiddenmodalput: true
    })
  },
  voteTitle: function (e) {
    ml = e.detail.value;
  },
  clean: function (e) {
    var _this = this
    wx.showModal({
      title: '清除数据',
      content: '确实要将当前数据删除吗？',
      success: function (res) {
        console.log(res.confirm)
        if (res.confirm) {
          done = 0
          wx.setStorageSync('water', done)
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
          done = 0
          console.log(done)
          var p = done / 2000
          console.log(p)
          var step = 1, startAngle = -0.5 * Math.PI, endAngle = 0;
          endAngle = 2 * p * Math.PI + startAngle;
          console.log(startAngle)
          drawArc(startAngle, endAngle);
          step++;
          _this.setData({
            done: done
          })
        }
      }
    })
  }
})