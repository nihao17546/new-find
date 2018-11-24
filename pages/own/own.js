const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login_btn_txt: '微信登录',
    logined: false,
    userInfo: {}
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
    if (typeof(app.globalData.userInfo.token) != "undefined") {
      this.setData({
        login_btn_txt: '已登录',
        logined: true,
        userInfo: app.globalData.userInfo
      })
    } else {
      this.setData({
        login_btn_txt: '微信登录',
        logined: false,
        userInfo: {}
      })
    }
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

  login: function() {
    this.setData({
      login_btn_txt: '登录中...'
    })
    app.login(() => {
      this.setData({
        login_btn_txt: '已登录',
        logined: true,
        userInfo: app.globalData.userInfo
      })
    }, () => {
      this.setData({
        login_btn_txt: '微信登录',
        logined: false,
        userInfo: {}
      })
    }, () => {
      wx.openSetting({
        success: (data) => {
          if (data.authSetting["scope.userInfo"] == true) {
            this.login()
          } else {
            app.alert('登录失败', '获取授权信息失败')
          }
        }
      })
    })
  },

  logout: function() {
    app.confirm('退出', '确定要退出吗？',
      () => {
        app.globalData.userInfo = {};
        this.setData({
          login_btn_txt: '微信登录',
          logined: false,
          userInfo: {}
        });
        wx.clearStorage()
      })
  }
})