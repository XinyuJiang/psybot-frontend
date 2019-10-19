const formatTime = date => {
  //const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

//<<<<<<< HEAD
const backendTime = date => {   //后台接口标准格式
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//=======
//>>>>>>> 95cbf1a50c8a0aeacb3ee91ce43e94e21588c1e4
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const minutes = date => {
  const minute = date.getMinutes()
  return minute
}
const currentDay = date => {
  const currentDay = date.getDate()
  return currentDay
}





const diaryTime_list = date => {
  var diaryTime = []
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const year = date.getFullYear()
  const month = monthNames[date.getMonth()]
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  diaryTime.time = hour + ':' + min
  diaryTime.day = day
  diaryTime.other = month + ',' + year
  return diaryTime
}

const diaryTime_new = date => {
  var diaryTime = []
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() //日期
  const week = date.getDay() //星期
  const hour = date.getHours()
  const min = date.getMinutes()
  diaryTime.week = dayNames[week]
  diaryTime.date = year + '/' + month + '/' + day
  return diaryTime
}

// 分享页面使用的时间格式
function shareTime(date) {
  var shareTime = []

  var dayNames = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']

  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  const week = date.getDay() //星期

  shareTime = year + '年' + month + '月' + day + '日 ' + dayNames[week]
  return shareTime
}


module.exports = {
  formatTime: formatTime,
  backendTime: backendTime,
  minutes: minutes,
  currentDay: currentDay,
  diaryTime_list: diaryTime_list,
  diaryTime_new: diaryTime_new,
  shareTime: shareTime
}
