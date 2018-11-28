const basePath = 'http://127.0.0.1:8080';
const httpUrls = {
  login: basePath + '/user/login',
  auth: basePath + '/user/auth',
  hot: basePath + '/hot/list',
  random: basePath + '/image/random',
  query: basePath + '/image',
  look: basePath + '/draw/look',
  face: basePath + '/draw/face'
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