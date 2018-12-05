const basePath = 'http://192.168.129.250:9090/find';
const httpUrls = {
  login: basePath + '/user/login',
  auth: basePath + '/user/auth',
  hot: basePath + '/hot/list',
  random: basePath + '/image/random',
  query: basePath + '/image',
  look: basePath + '/draw/look',
  face: basePath + '/draw/face',
  favePics: basePath + '/image/fave',
  rmFavo: basePath + '/user/rmFavo',
  insertFavo: basePath + '/user/favo',
  messageList: basePath + '/message/list',
  share: basePath + '/user/share',
  faceResultOne: basePath + '/face/result/one'
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