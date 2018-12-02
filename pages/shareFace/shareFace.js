const config = require('../../utils/config.js');
const call = require("../../utils/request.js");
const app = getApp();
var ctx = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: {},
    windowWidth: '',
    windowHeight: '',
    canvasWidth: '',
    canvasHeight: '',
    image_show_width: '',
    image_left: '',
    image_top: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({ //设置宽高为屏幕宽，高为屏幕高减去50 
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          canvasWidth: res.windowWidth,
          image_show_width: res.windowWidth * 0.9,
          image_left: (res.windowWidth - res.windowWidth * 0.9) / 2,
          image_top: 0
        })
      },
    })
    if (options.faceResultId && options.faceResultId > 0) {
      call.doGet(config.httpUrls.faceResultOne, {
        id: options.faceResultId
      },
        data => {
          if (data.code == config.httpStatus.OK) {
            if (options.faceUrl && options.faceUrl != '') {
              this.setData({
                result: data.response,
                faceUrl: options.faceUrl
              })
            }
            else {
              this.setData({
                result: data.response,
                faceUrl: data.response.face.faceUrl
              })
            }
            ctx = wx.createCanvasContext('myCanvas');
            let image = this.data.faceUrl
            this.drawPic(this.data.result.face, image)
          }
          else {
            wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 3500
            })
          }
        }, () => {
          wx.showToast({
            title: '抱歉服务异常，请稍后再试！',
            icon: 'none',
            duration: 3500
          })
        });
    }
    else {
      wx.switchTab({
        url: '/pages/play/play'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  drawPic: function (faceListVO, image) {
    let image_show_width = this.data.image_show_width;
    let image_show_height = image_show_width / faceListVO.width * faceListVO.height;
    this.setData({
      canvasHeight: image_show_height
    })
    let image_left = this.data.image_left;
    let image_top = this.data.image_top;
    ctx.drawImage(image, image_left, image_top,
      image_show_width, image_show_height)
    ctx.setFontSize(20)
    if (faceListVO.faces && faceListVO.faces.length > 0) {
      let pre_left = 0;
      let pre_top = 0;
      let pre_rate = 0;
      faceListVO.faces.forEach(face => {
        ctx.rotate(- pre_rate * Math.PI / 180)

        // 计算面部在原图中中心坐标点
        let face_center_real_left = face.location.left + face.location.width / 2;
        let face_center_real_top = face.location.top + face.location.height / 2;
        // 计算面部在画布中的中心坐标点
        let face_center_image_left = image_show_width / faceListVO.width * face_center_real_left + image_left;
        let face_center_image_top = image_show_height / faceListVO.height * face_center_real_top + image_top;
        // 设置面部在画布中的中心点
        ctx.translate(face_center_image_left - pre_left, face_center_image_top - pre_top);
        pre_left = face_center_image_left;
        pre_top = face_center_image_top;

        if (face.location.rotation > 0) {
          ctx.rotate(face.location.rotation * Math.PI / 180)
        }
        else {
          ctx.rotate((face.location.rotation + 360) * Math.PI / 180)
        }
        pre_rate = face.location.rotation;

        // 计算面部在画布中的宽高
        let face_image_width = image_show_width / faceListVO.width * face.location.width;
        let face_image_height = image_show_height / faceListVO.height * face.location.height;
        ctx.setStrokeStyle('red');
        ctx.strokeRect(face_image_width / -2, face_image_height / -2, face_image_width, face_image_height);
        if (faceListVO.faces.length > 1) {
          ctx.strokeText(face.num, face_image_width / -2, face_image_height / -2)
        }
      })
    }
    else {
      app.alert('糟糕', '该照片中未识别出人物头像!');
    }
    ctx.draw();
  },

  fun: function(e) {
    wx.switchTab({
      url: '/pages/play/play'
    })
  }
})