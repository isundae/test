const { default: axios } = require('axios')
const dayjs = require('dayjs')
require('dotenv').config()

// 获取token
const getAccessToken = async (
  url = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken'
) => {
  const corpid = process.env.corpid
  const corpsecret = process.env.corpsecret
  const {
    data: { access_token }
  } = await axios.get(url, {
    params: { corpid, corpsecret }
  })
  return access_token
}

// 获取土味情话
const getQinghua = async (
  QINGHUA_RUL = 'https://api.uomg.com/api/rand.qinghua'
) => {
  const qinghua = await axios.get(QINGHUA_RUL)
  return qinghua.data.content
}

// 获取天气信息
const getWeather = async (
  WEAHTER_URL = 'https://devapi.qweather.com/v7/weather/3d'
) => {
  const weather = await axios.get(WEAHTER_URL, {
    params: {
      key: process.env.weather_key,
      location: process.env.weather_location // 地理位置经纬度
    }
  })
  return weather.data.daily
}

// 获取当前时间
const getDate = () => {
  return {
    length: Math.abs(dayjs().diff(process.env.anniversary, 'days')),
    birthday: Math.abs(dayjs().diff(process.env.birthday, 'days'))
  }
}

// 获取模板
const getTpl = async () => {
  const { length, birthday } = getDate()
  const weather = await getWeather()
  const qinghua = await getQinghua()
  return {
    touser: '@all',
    toparty: 'P@all',
    totag: '@all',
    msgtype: 'textcard',
    agentid: process.env.agentid,
    textcard: {
      title: `今天是我们相恋的第 ${length} 天 💓`,
      description: `    🌍 当前城市：赤峰 
    ☆*.｡.不管哪一天，都是爱你的一天.｡.:*☆
    💨 今日天气：${weather[0].textDay}(${weather[0].tempMin}℃ ~ ${weather[0].tempMax}℃)
    🌤️ 日出时间：${weather[0].sunrise}
    🌀 明日天气：${weather[1].textDay}
    🧧 距离你的生日还有 ${birthday} 天❗
    ------------------- 💓 -------------------
    ${qinghua}`,
      url: process.env.myurl
    }
  }
}

// 发送消息
const sendMsg = async (
  url = 'https://qyapi.weixin.qq.com/cgi-bin/message/send'
) => {
  const access_token = await getAccessToken()
  const tpl = await getTpl()
  return await axios.post(url, tpl, { params: { access_token } })
}

sendMsg()
