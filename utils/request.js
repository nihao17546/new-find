function postJson(url, postData, doSuccess, doFail) {
  wx.request({
    url: url,
    data: postData,
    method: 'POST',
    header: {
      "content-type": "application/json;charset=UTF-8"
    },
    success: function (res) {
      if (doSuccess) {
        doSuccess(res.data)
      }
    },
    fail: function () {
      if (doFail) {
        doFail();
      }
    }
  })
}

function doPost(url, postData, doSuccess, doFail) {
  wx.request({
    url: url,
    data: postData,
    method: 'POST',
    success: function (res) {
      if (doSuccess) {
        doSuccess(res.data)
      }
    },
    fail: function () {
      console.error('http fail: ' + url)
      if (doFail) {
        doFail();
      }
    }
  })
}

//GET请求，不需传参，直接URL调用，
function doGet(url, getData, doSuccess, doFail) {
  wx.request({
    url: url,
    data: getData,
    method: 'GET',
    success: function (res) {
      if (doSuccess) {
        doSuccess(res.data)
      }
    },
    fail: function () {
      console.error('http fail: ' + url)
      if (doFail) {
        doFail();
      }
    }
  })
}

module.exports.doPost = doPost;
module.exports.doGet = doGet;
module.exports.postJson = postJson;