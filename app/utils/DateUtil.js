/**
 * 日期转换工具
 * @author keyy/1501718947@qq.com 16/12/2 10:16
 * @description 一些简单的日期转换方法
 */

/**
 * 日期转字符串日期2016-07-25
 * @returns {String} 2016-07-25
 */
export function dataFormatDay(data) {
  let year, month, day, formatDateDay;
  // 初始化时间
  year = data.getFullYear();
  month = data.getMonth() + 1;
  day = data.getDate();
  formatDateDay = year;

  if (month >= 10) {
    formatDateDay = formatDateDay + "-" + month;
  } else {
    formatDateDay = formatDateDay + "-0" + month;
  }
  if (day >= 10) {
    formatDateDay = formatDateDay + "-" + day;
  } else {
    formatDateDay = formatDateDay + "-0" + day;

  }
  return formatDateDay;
}

/**
 * 日期加减(date,number,string)
 * @description 针对年月日进行加减
 * @param {Date} date 日期对象
 * @param {Number} value 数字,+1/-1
 * @param {String} type 要计算的时间类型('year'/'month'/'date')
 */
export function dateMath(date, value, type) {
  let fn = {
    year: "FullYear",
    month: "Month",
    date: "Date"
  };
  date["set" + fn[type]](date["get" + fn[type]]() + value);
  return date;
}

/**
 * 字符串转日期
 * @param {String} data 2016-12-12 20:08:27
 * @returns {Date}
 */
export function strToDateTime(data) {
  return new Date(data.replace(/-/g,"/"));
}

/**
 * 日期转字符串 转换成"2016-06-14 14:24:13"
 * @param {Date} data Date日期
 * @returns {String} str 字符串日期2016-06-14 14:24:13
 */
export function dateFormat(data) {
  let year, month, day, hours, minutes, seconds, formatDate;
  // 初始化时间
  year = data.getFullYear();
  month = data.getMonth() + 1;
  day = data.getDate();
  hours = data.getHours();
  minutes = data.getMinutes();
  seconds = data.getSeconds();
  formatDate = year;

  if (month >= 10) {
    formatDate = formatDate + "-" + month;
  } else {
    formatDate = formatDate + "-0" + month;
  }
  if (day >= 10) {
    formatDate = formatDate + "-" + day;
  } else {
    formatDate = formatDate + "-0" + day;
  }
  if (hours >= 10) {
    formatDate = formatDate + " " + hours;
  } else {
    formatDate = formatDate + " 0" + hours;
  }
  if (minutes >= 10) {
    formatDate = formatDate + ":" + minutes;
  } else {
    formatDate = formatDate + ":0" + minutes;
  }
  if (seconds >= 10) {
    formatDate = formatDate + ":" + seconds;
  } else {
    formatDate = formatDate + ":0" + seconds;
  }
  return formatDate;
}