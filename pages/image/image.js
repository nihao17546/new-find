const config = require('../../utils/config.js');
const call = require("../../utils/request.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContextShow: false,
    inputVal: "",
    pics: [{
      path1: 'http://img4.imgtn.bdimg.com/it/u=3294000478,3463074550&fm=26&gp=0.jpg',
      path2: 'http://img4.imgtn.bdimg.com/it/u=3294000478,3463074550&fm=26&gp=0.jpg',
      path3: 'http://img4.imgtn.bdimg.com/it/u=3294000478,3463074550&fm=26&gp=0.jpg'
    }],
    hots: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    call.doGet(config.httpUrls.hot, {},
      data => {
        if (data.code == config.httpStatus.OK) {
          this.initHots(data.response)
        }
      }, () => {

      })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('下拉');
    setTimeout(function() {
      console.log('停止下拉');
      wx.stopPullDownRefresh()
    }, 1000)
  },

  showInput: function() {
    this.setData({
      searchContextShow: true
    });
  },

  hideInput: function() {
    this.setData({
      inputVal: "",
      searchContextShow: false
    });
  },

  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },

  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  bindfocus: function(e) {
    this.setData({
      searchContextShow: true
    })
  },

  bindblur: function(e) {},

  formSubmit: function(e) {
    console.log('submit:' + this.data.inputVal)
  },

  getLength: function strlen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      //单字节加1 
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        len++;
      } else {
        len += 2;
      }
    }
    return len;
  },

  initHots: function (hotKeys) {
    let hotss = [];
    let length = 0;
    let hotLine = [];
    hotKeys.forEach(hotKey => {
      let len = this.getLength(hotKey) + 2;
      if (length + len > 31) {
        hotss.push(hotLine);
        length = 0;
        hotLine = [];
      }
      length += len;
      hotLine.push(hotKey)
    })
    if (hotLine.length > 0) {
      hotss.push(hotLine)
    }
    this.setData({
      hots: hotss
    })
  }
})