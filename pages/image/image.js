const config = require('../../utils/config.js');
const call = require("../../utils/request.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContextShow: false,
    inputVal: '',
    page: 1,
    totalPage: 1,
    pics: [],
    pictures: [],
    picIds: [],
    hots: [],
    openPic: true,
    searchPlaceholder: '搜索'
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

      });
    this.randomImage()
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let nextPage = this.data.page + 1;
    if (this.data.inputVal.length > 0 && nextPage < this.data.totalPage) {
      let url = config.httpUrls.query + '/' + encodeURI(this.data.inputVal) + '/' + nextPage + '/15';
      call.doGet(url, {},
        data => {
          if (data.code == config.httpStatus.OK) {
            if (data.response.length > 0) {
              let result = this.fillImages(data.response)
              this.setData({
                pics: result.pics,
                pictures: result.pictures,
                picIds: result.picIds,
                totalPage: data.totalPage,
                page: nextPage
              })
            }
          } else {

          }
          this.setData({
            searchContextShow: false
          });
          wx.hideLoading()
        }, () => {
          wx.hideLoading()
        })
    }
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
    this.hideInput()
    this.randomImage()
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
    if (this.data.inputVal.length > 0) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        page: 1,
        totalPage: 1,
        pics: [],
        pictures: [],
        picIds: []
      })
      let url = config.httpUrls.query + '/' + encodeURI(this.data.inputVal) + '/' + this.data.page + '/15';
      call.doGet(url, {},
        data => {
          if (data.code == config.httpStatus.OK) {
            if (data.response.length > 0) {
              let result = this.fillImages(data.response)
              this.setData({
                pics: result.pics,
                pictures: result.pictures,
                picIds: result.picIds,
                totalPage: data.totalPage
              })
            }
          } else {

          }
          this.setData({
            searchContextShow: false
          });
          wx.hideLoading()
        }, () => {
          wx.hideLoading()
        })
    }
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

  initHots: function(hotKeys) {
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
  },

  fillImages: function(images) {
    let p1 = [],
      p2 = [],
      p3 = [],
      p = [];
    let pp = [],
      ids = [];
    for (let i = 0; i < images.length; i++) {
      let cs;
      let ss = images[i].src;
      if (images[i].compressSrc) {
        cs = images[i].compressSrc;
      } else {
        cs = images[i].src;
      }
      if (i % 3 == 0) {
        p1.push(cs);
      } else if (i % 3 == 1) {
        p2.push(cs);
      } else {
        p3.push(cs);
      }
      pp.push(ss);
      ids.push(images[i].id);
    }
    let len = Math.max(p1.length, p2.length, p3.length)
    for (let i = 0; i < len; i++) {
      var obj = {};
      if (typeof(p1[i]) != "undefined") {
        obj.path1 = p1[i];
      }
      if (typeof(p2[i]) != "undefined") {
        obj.path2 = p2[i];
      }
      if (typeof(p3[i]) != "undefined") {
        obj.path3 = p3[i];
      }
      p.push(obj);
    }
    let result = {
      pics: p,
      pictures: pp,
      picIds: ids
    }
    return result;
  },

  randomImage: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      page: 1,
      totalPage: 1,
      inputVal: '',
      pics: [],
      pictures: [],
      picIds: []
    })
    call.doGet(config.httpUrls.random, {},
      data => {
        if (data.code == config.httpStatus.OK) {
          if (data.response.length > 0) {
            let result = this.fillImages(data.response)
            this.setData({
              pics: result.pics,
              pictures: result.pictures,
              picIds: result.picIds
            })
          }
        } else {

        }
        wx.hideLoading()
      }, () => {
        wx.hideLoading()
      })
  },

  showPic: function(e) {
    var index = parseInt(e.currentTarget.dataset.index),
      pa = parseInt(e.currentTarget.dataset.pa),
      pictures = this.data.pictures;
    var ind = index * 3 + pa;
    if (ind < pictures.length) {
      wx.previewImage({
        current: pictures[ind],
        urls: pictures
      })
    }
  }
})