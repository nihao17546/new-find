const config = require('utils/config.js');
const call = require("utils/request.js")
App({
  globalData: {
    userInfo: {}
  },

  onLaunch: function() {
    this.login()
  },

  login: function(doSuccess, doFail, openSetting) {
    wx.getStorage({
      key: 'token',
      success: res => {
        call.doGet(config.httpUrls.login, {
          token: res.data
        }, data => {
          if (data.code == config.httpStatus.OK) {
            this.globalData.userInfo = data.response;
            wx.setStorage({
              key: 'token',
              data: data.response.token,
            })
            if (doSuccess) {
              doSuccess()
            }
          } else {
            wx.removeStorage({
              key: 'token'
            })
            if (doFail) {
              doFail()
            }
            this.alert('服务异常', data.message)
          }
        }, () => {
          if (doFail) {
            doFail()
          }
          this.alert()
        })
      },
      fail: () => {
        this.globalData.userInfo = {};
        wx.login({
          success: resLogin => {
            if (resLogin.code) {
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: res => {
                        res.code = resLogin.code;
                        call.postJson(config.httpUrls.auth, res,
                          data => {
                            if (data.code == config.httpStatus.OK) {
                              this.globalData.userInfo = data.response;
                              wx.setStorage({
                                key: 'token',
                                data: data.response.token,
                              })
                              if (doSuccess) {
                                doSuccess()
                              }
                            } else {
                              if (doFail) {
                                doFail()
                              }
                              this.alert('服务异常', data.message)
                            }
                          }, () => {
                            if (doFail) {
                              doFail()
                            }
                            this.alert()
                          })
                        if (this.userInfoReadyCallback) {
                          this.userInfoReadyCallback(res)
                        }
                      }
                    })
                  } else {
                    if (openSetting) {
                      openSetting()
                    } else {
                      this.alert('登录失败', '获取授权信息失败')
                    }
                  }
                }
              })
            } else {
              if (doFail) {
                doFail()
              }
              this.alert('登录失败', resLogin.errMsg)
            }
          }
        })
      }
    })
  },

  alert: function(title, content) {
    let t = '服务异常'
    let c = '抱歉，服务异常，请稍后再试！'
    if (title) {
      t = title
    }
    if (content) {
      c = content
    }
    wx.showModal({
      title: t,
      content: c,
      showCancel: false,
      success: (showModalRes) => {
        if (showModalRes.confirm) {} else if (showModalRes.cancel) {}
      }
    })
  },

  confirm: function(title, content, yes, no) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: true,
      success: (showModalRes) => {
        if (showModalRes.confirm) {
          if (yes) {
            yes()
          }
        } else if (showModalRes.cancel) {
          if (no) {
            no()
          }
        }
      }
    })
  }
})