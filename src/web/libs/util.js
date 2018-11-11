// 获取描述对象的值
export const getObjectValue = (obj, des) => {
  return eval('obj.' + des) // eslint-disable-line
}

/**
 * 对象比较器
 * 使用方法：data.sort(compare("对象名称")) 在对象内部排序，不生成副本
 * @param  {[type]} propertyName 要排序的对象的子名称（限一级）
 * @return {[type]}              排序规则
 */
export const compareObject = propertyName => {
  return function (object1, object2) {
    var value1 = getObjectValue(object1, propertyName)
    var value2 = getObjectValue(object2, propertyName)
    if (value2 < value1) {
      return -1
    } else if (value2 > value1) {
      return 1
    } else {
      return 0
    }
  }
}

/**
 * 根据含义字符串换算对应的毫秒数
 * @param  {[type]} str 字符串
 * @return {[type]}     ms
 */
let getsec = function (str) {
  if (/[s|h|d|l]/i.test(str)) {
    var str1 = str.substring(0, str.length - 1)
    var str2 = str.substring(str.length - 1, str.length)
    if (str2 === 's') {
      return str1 * 1000
    } else if (str2 === 'h') {
      return str1 * 60 * 60 * 1000
    } else if (str2 === 'd') {
      return str1 * 24 * 60 * 60 * 1000
    }
  } else {
    if (str.indexOf('l') === -1) {
      return str * 1000
    } else {
      return 30 * 24 * 60 * 60 * 1000
    }
  }
}

// 写 cookies
export const setCookie = function setCookie (name, value, time) {
  if (time) {
    let strsec = getsec(time)
    let exp = new Date()
    exp.setTime(exp.getTime() + parseInt(strsec))
    document.cookie =
      name + '=' + escape(value) + ';expires=' + exp.toGMTString()
  } else {
    document.cookie = name + '=' + escape(value)
  }
}

// 读 cookies
export const getCookie = function (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  return arr ? unescape(arr[2]) : null
}

// 删 cookies
export const delCookie = function (name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

// 获取Token
export const getToken = function () {
  if (window.localStorage) {
    return window.localStorage.getItem('token')
  }
}

// 设置Token
export const setToken = function (token) {
  if (window.localStorage) {
    window.localStorage.setItem('token', token)
  } else if (window.localStorage) {
    window.localStorage.setItem('token', token)
  }
}

// 删除Token
export const delToken = function () {
  if (window.localStorage) {
    window.localStorage.removeItem('token')
  }
}

/**
 * 根据host返回根域名
 * @param  {[string]} host [window.location.host]
 * @return {[string]}      [如果不是域名则返回IP]
 */
export const getDomain = host => {
  host = host.split(':')[0]
  return isNaN(host.substring(host.lastIndexOf('.')))
    ? host.substring(
      host.substring(0, host.lastIndexOf('.')).lastIndexOf('.') + 1
    )
    : host
}

/**
 * 判断对象是否为空
 * @param  {[type]}  e [对象]
 * @return {Boolean}   [bool]
 */
export const isEmptyObject = e => {
  for (let t in e) {
    return !1
  }
  return !0
}

/*
 * 版本号比较方法
 * 传入两个字符串，当前版本号：curV；比较版本号：reqV
 * 调用方法举例：compare("1.1","1.2")，将返回false
 */
export const compareVersion = (curV, reqV) => {
  if (curV && reqV) {
    // 将两个版本号拆成数字
    let arr1 = curV.split('.')
    let arr2 = reqV.split('.')
    var minLength = Math.min(arr1.length, arr2.length)
    let position = 0
    let diff = 0
    // 依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
    while (position < minLength && ((diff = parseInt(arr1[position]) - parseInt(arr2[position])) === 0)) {
      position++
    }
    diff = (diff !== 0) ? diff : (arr1.length - arr2.length)
    // 若curV大于reqV，则返回true
    return diff > 0
  } else {
    // 输入为空
    console.log('版本号不能为空')
    return false
  }
}
