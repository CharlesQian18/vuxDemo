export function formatDate (time) {
  // 兼容ios  IOS只识别2017/01/01这种格式
  time = time + ''
  time = time.replace(/-/g, '/') // 日期格式处理

  var newDate = /\d{4}\/\d{1,2}\/\d{1,2}/g.exec(time)
  // alert(newDate)
  // alert(newDate)
  const d = new Date(newDate)
  // return d.getFullYear().toString() + '年' + (d.getMonth() + 1).toString() + '月' + d.getDate().toString() + '日'

  return d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString() + '-' + (d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate().toString())
}

export function formatTime (time) {
  // 兼容ios  IOS只识别2017/01/01这种格式
  time = renderTime(time)
  time = time.replace(/-/g, '/') // 日期格式处理

  var newDate = /\d{4}\/\d{1,2}\/\d{1,2}/g.exec(time)
  // alert(newDate)
  // alert(newDate)
  const d = new Date(newDate)
  console.log(d)
  // return d.getFullYear().toString() + '年' + (d.getMonth() + 1).toString() + '月' + d.getDate().toString() + '日'
  return d.getHours().toString() + ':' + d.getMinutes.toString()
}

export function renderTime (date) {
  var dateee = new Date(date).toJSON()
  return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

/**
 * Created by jiachenpan on 16/11/18.
 */
// 将时间格式化
export function parseTime (time, cFormat) {
  if (arguments.length === 0 || !time) {
    return ''
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) {
      // 时间戳 1493269366000，000代表毫秒
      time = parseInt(time) * 1000
    }
    // 日期格式处理
    // time = new Date(time.replace(/-/g, '/'))
    date = new Date(renderTime(time).replace(/-/g, '/'))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  var timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]

    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}
