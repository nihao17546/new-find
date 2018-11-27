const config = require('../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultPic: 'http://mydata.appcnd.com/tou.png',
    btnHtml: '上传人脸照片'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  chooseFacePic: function(e) {
    if (e.detail.userInfo) {
      app.login(() => {
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            wx.uploadFile({
              url: config.httpUrls.face,
              filePath: res.tempFilePaths[0],
              name: 'file',
              header: {
                token: app.globalData.userInfo.token
              },
              success: resUpload => {
                console.log(resUpload)
                if (resUpload.statusCode != 200) {
                  app.alert('服务异常', '抱歉服务异常，请稍后再试！')
                }
                else {

                }
              },
              fail: resUpload => {
                app.alert('服务异常', '抱歉服务异常，异常信息:' + resUpload.errMsg)
              }
            })
          }
        })
      }, () => {

      })
    } else {
      app.alert('获取微信授权信息失败', '请登录后体验此功能！')
    }
  }
})