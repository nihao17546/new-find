const config = require('../../utils/config.js');
const call = require("../../utils/request.js");
const app = getApp();
var sliderWidth = 96;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login_btn_txt: '微信登录',
    logined: false,
    userInfo: {},
    tabs: ["收藏", "消息"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    navbar_position: '',
    navbar_top: '0',
    fave: {
      pics: [],
      page: 1,
      totalPage: 1,
      loaded: false
    },
    msg: {
      list: [],
      offset: 0,
      hasNest: true,
      loaded: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
      }
    });
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
    if (typeof (app.globalData.userInfo.token) != "undefined") {
      this.setData({
        login_btn_txt: '已登录',
        logined: true,
        userInfo: app.globalData.userInfo
      })
      if (!this.data.fave.loaded || app.globalData.hasNewFavo) {
        this.getFavePic(1)
        app.globalData.hasNewFavo = false;
      }
      if (!this.data.msg.loaded) {
        this.getMessage(0)
      }
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
    let nextPage = this.data.fave.page + 1;
    if (this.data.activeIndex == 0 > 0 && nextPage <= this.data.fave.totalPage) {
      this.getFavePic(nextPage)
    }
    if (this.data.activeIndex == 1 && this.data.msg.hasNest) {
      this.getMessage(this.data.msg.offset)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  login: function (e) {
    this.setData({
      login_btn_txt: '登录中...'
    })
    if (e.detail.userInfo) {
      app.login(() => {
        this.setData({
          login_btn_txt: '已登录',
          logined: true,
          userInfo: app.globalData.userInfo
        })
        this.getFavePic(1);
        this.getMessage(0)
      }, () => {
        this.setData({
          login_btn_txt: '微信登录',
          logined: false,
          userInfo: {}
        })
      })
    } else {
      wx.showToast({
        title: '获取授权信息失败',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        login_btn_txt: '微信登录'
      })
    }
  },

  logout: function () {
    app.confirm('退出', '确定要退出吗？',
      () => {
        wx.showLoading({
          title: '',
          mask: true
        })
        setTimeout(() => {
          app.globalData.userInfo = {};
          this.setData({
            login_btn_txt: '微信登录',
            logined: false,
            userInfo: {}
          });
          wx.removeStorage({
            key: 'token'
          })
          this.setData({
            fave: {
              pics: [],
              pictures: [],
              picIds: [],
              page: 1,
              totalPage: 1,
              loaded: false
            },
            msg: {
              list: [],
              offset: 0,
              hasNest: true,
              loaded: false
            }
          })
          wx.hideLoading()
        }, 500)

      })
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },

  onPageScroll: function (e) {
    if (e.scrollTop >= 100) {
      this.setData({
        navbar_position: 'fixed'
      })
    } else {
      this.setData({
        navbar_position: ''
      })
    }
  },

  getFavePic: function (curPage) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    call.doGet(config.httpUrls.favePics, {
      curPage: curPage
    },
      data => {
        if (data.code == config.httpStatus.OK) {
          let images = data.response.list;
          if (curPage > 1) {
            images = this.data.fave.pics.concat(data.response.list);
          }
          this.setData({
            fave: {
              pics: images,
              page: data.response.curPage,
              totalPage: data.response.totalPage,
              loaded: true
            }
          })
          wx.hideLoading();
        }
      }, () => {
        wx.hideLoading();
        wx.showToast({
          title: '抱歉服务异常请稍后再试！',
          icon: 'none',
          duration: 3000
        })
      }, {
        token: app.globalData.userInfo.token
      });
  },

  getMessage: function (offset) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    call.doGet(config.httpUrls.messageList, {
      offset: offset
    },
      data => {
        if (data.code == config.httpStatus.OK) {
          let messages = data.response;
          if (messages.length == 0) {
            this.setData({
              msg: {
                list: this.data.msg.list,
                offset: offset,
                hasNest: false,
                loaded: true
              }
            })
          }
          else {
            if (offset > 0) {
              messages = this.data.msg.list.concat(data.response);
            }
            this.setData({
              msg: {
                list: messages,
                offset: offset + data.response.length,
                hasNest: true,
                loaded: true
              }
            })
          }
          wx.hideLoading();
        }
      }, () => {
        wx.hideLoading();
        wx.showToast({
          title: '抱歉服务异常请稍后再试！',
          icon: 'none',
          duration: 3000
        })
      }, {
        token: app.globalData.userInfo.token
      });
  },

  showFavePic: function (e) {
    if (this.endTime - this.startTime < 350) {
      let index = parseInt(e.currentTarget.dataset.index);
      if (index < this.data.fave.pics.length) {
        wx.previewImage({
          urls: [this.data.fave.pics[index].src]
        })
      }
    }
    else {
      this.rmFavo(e)
    }
  },

  rmFavo: function (e) {
    app.confirm('移除', '确认移除该图片？',
      () => {
        wx.showLoading({
          title: '',
          mask: true
        })
        let index = parseInt(e.currentTarget.dataset.index);
        call.doGet(config.httpUrls.rmFavo, {
          picId: this.data.fave.pics[index].id
        }, data => {
          wx.hideLoading()
          if (data.code == 200) {
            wx.showToast({
              title: '操作成功',
              duration: 2000
            })
            setTimeout(() => {
              this.getFavePic(1)
            }, 1000)
          }
          else {
            wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 2000
            })
          }
        }, () => {
          wx.hideLoading()
        }, {
            token: app.globalData.userInfo.token
          })
      }, () => {
      })
  },

  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },

  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  }
})