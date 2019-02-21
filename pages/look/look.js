const config = require('../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: '',
    windowHeight: '',
    image_width: '',
    image_height: '',
    whenLook: false,
    img_path: '../../images/look.jpeg',
    word_value: '',
    add_btn_text: '选择表情图片'
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
          image_width: res.windowWidth * 0.7,
          image_height: res.windowWidth * 0.7
        })
      },
    })
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

  chooseLookPic: function (e) {
    wx.showLoading({
      title: '处理中',
      mask: true
    })
    if (e.detail.userInfo) {
      app.login(() => {
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: res => {
            this.setData({
              whenLook: true,
              img_path: res.tempFilePaths[0]
            })
            wx.hideLoading()
          },
          fail: res => {
            wx.hideLoading()
          }
        })
      }, () => {
        wx.hideLoading()
      })
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '获取微信授权信息失败,请登录后体验此功能！',
        icon: 'none',
        duration: 3000
      })
    }
  },

  cancel: function () {
    this.setData({
      whenLook: false,
      img_path: '../../images/look.jpeg',
      word_value: '',
      add_btn_text: '选择表情图片'
    })
  },

  add_word: function (e) {
    let word = e.detail.value.word.trim();
    let color = e.detail.value.color;
    let pos = e.detail.value.pos;
    let size = e.detail.value.size;
    let type = e.detail.value.type;
    if (word == '') {
      wx.showToast({
        title: '请输入需要添加的文字',
        icon: 'success',
        duration: 1100
      })
      return;
    }
    wx.showLoading({
      title: '处理中',
      mask: true
    })
    wx.uploadFile({
      url: config.httpUrls.look,
      filePath: this.data.img_path,
      name: 'file',
      formData: {
        word: word,
        pos: pos,
        size: size,
        color: color,
        family: '宋体',
        type: type
      },
      header: {
        token: app.globalData.userInfo.token
      },
      success: res => {
        if (res.statusCode != config.httpStatus.OK) {
          wx.hideLoading()
          app.alert('服务异常', '抱歉服务异常，请稍后再试！')
        } else {
          let response = JSON.parse(res.data);
          if (response.code == config.httpStatus.OK) {
            wx.hideLoading()
            this.setData({
              img_path: response.response.src,
              whenLook: false,
              add_btn_text: '重新制作'
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: response.message,
              icon: 'none',
              duration: 3000
            })
          }
        }
      },
      fail: res=> {
        wx.hideLoading()
        app.alert('服务异常', '抱歉服务异常，异常信息:' + res.errMsg)
      }
    })
  },

  showPic: function (e) {
    if (this.data.add_btn_text == '重新制作') {
      wx.previewImage({
        current: 0,
        urls: [this.data.img_path]
      })
    }
  }
})