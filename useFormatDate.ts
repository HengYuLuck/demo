// 获取YYYY-mm-dd HH:MM:SS格式时间, 使用: formatDate('YYYY-mm-dd HH:MM:SS',new Date())
export const formatDate = (formatType: string, date: Date) => {
  let ret = $ref<any>()
  let valueDate = date
  if (!date)
    valueDate = new Date()
  const opt = {
    'Y+': valueDate.getFullYear().toString(), // 年
    'm+': (valueDate.getMonth() + 1).toString(), // 月
    'd+': valueDate.getDate().toString(), // 日
    'H+': valueDate.getHours().toString(), // 时
    'M+': valueDate.getMinutes().toString(), // 分
    'S+': valueDate.getSeconds().toString(), // 秒
  }
  for (const k in opt) {
    ret = new RegExp(`(${k})`).exec(formatType)
    if (ret)
      formatType = formatType.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
  }
  return formatType
}

/**
 * 获取当前时间 往前或往后多少天 / 往前或往后多少秒
 * @remarks
 * 获取当前时间 / 往前或往后多少天 / 往前或往后多少秒
 *
 * @param num - 第一个参数，表示天数或秒数，setSecond为true代表秒数，否则代表天数，正负值均可
 * @param setType - 第二个参数，表示是否设置秒数，正负值均可
 * @param isDate - 第三个参数，表示是否展示中文日期格式，布尔值，默认false
 *
 * @returns 时间: `${year}-${month}-${day} ${hour}:${minutes}:${second}`
 */
export const getNumTime = (num = 0, setType = 'day', isDate = false) => {
  const afterDate = new Date()
  switch (setType) {
    case 'day':
      afterDate.setDate(afterDate.getDate() + num)
      break
    case 'hour':
      afterDate.setHours(afterDate.getHours() + num)
      break
    case 'second':
      afterDate.setTime(afterDate.getTime() + num)
      break
    default:
      break
  }

  const year = afterDate.getFullYear()
  let month = `${afterDate.getMonth() + 1}`
  let day = `${afterDate.getDate()}`
  let hour = `${afterDate.getHours()}`
  let minutes = `${afterDate.getMinutes()}`
  let second = `${afterDate.getSeconds()}`
  if (+month > 0 && +month <= 9)
    month = `0${month}`

  if (+day > 0 && +day <= 9)
    day = `0${day}`

  if (+hour > 0 && +hour <= 9)
    hour = `0${hour}`

  if (+minutes > 0 && +minutes <= 9)
    minutes = `0${minutes}`

  if (+second > 0 && +second <= 9)
    second = `0${second}`

  if (isDate)
    return `${year}年${month}月${day}日${hour}:${minutes}:${second}`
  else
    return `${year}-${month}-${day} ${hour}:${minutes}:${second}`
}

