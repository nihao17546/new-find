const config = require('../../utils/config.js');
const call = require("../../utils/request.js");
const app = getApp();
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
            this.setData({
              result: data.response,
              faceUrl: data.response.face.faceUrl
            })
          }
          else {
            wx.showModal({
              title: '提示',
              content: data.message,
              showCancel: false,
              success: (showModalRes) => {
                wx.switchTab({
                  url: '/pages/play/play'
                })
              }
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

  fun: function(e) {
    wx.switchTab({
      url: '/pages/play/play'
    })
  }
})