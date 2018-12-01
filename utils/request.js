function postJson(url, postData, doSuccess, doFail) {
  wx.request({
    url: url,
    data: postData,
    method: 'POST',
    header: {
      "content-type": "application/json;charset=UTF-8"
    },
    success: function (res) {
      if (res.statusCode == 200) {
        if (doSuccess) {
          doSuccess(res.data)
        }
      }
      else {
        if (doFail) {
          doFail();
        }
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
      if (res.statusCode == 200) {
        if (doSuccess) {
          doSuccess(res.data)
        }
      }
      else {
        if (doFail) {
          doFail();
        }
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
function doGet(url, getData, doSuccess, doFail, header) {
  let requestHeader = {};
  if (header) {
    requestHeader = header;
  }
  wx.request({
    url: url,
    data: getData,
    method: 'GET',
    header: requestHeader,
    success: function (res) {
      if (res.statusCode == 200) {
        if (doSuccess) {
          doSuccess(res.data)
        }
      }
      else {
        if (doFail) {
          doFail();
        }
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