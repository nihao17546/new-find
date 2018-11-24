const basePath = 'http://192.168.0.104:8080';
const httpUrls = {
  login: basePath + '/user/login',
  auth: basePath + '/user/auth',
  hot: basePath + '/hot/list'
}
const staticResources = {
  play_head_img: 'http://activity.appcnd.com/paly.jpg'
}
const httpStatus = {
  OK: 200
}
module.exports.httpUrls = httpUrls;
module.exports.staticResources = staticResources;
module.exports.httpStatus = httpStatus;