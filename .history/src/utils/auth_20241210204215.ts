import Taro from '@tarojs/taro'

const TOKEN_KEY = 'user_token'
const USER_INFO_KEY = 'user_info'

// 保存用户信息到本地
export const setUserInfo = (userInfo: any) => {
  Taro.setStorageSync(USER_INFO_KEY, userInfo)
}

// 获取本地用户信息
export const getUserInfo = () => {
  return Taro.getStorageSync(USER_INFO_KEY)
}

// 清除本地用户信息
export const clearUserInfo = () => {
  Taro.removeStorageSync(USER_INFO_KEY)
}

// 检查是否已登录
export const checkIsLoggedIn = () => {
  const userInfo = getUserInfo()
  return !!userInfo
}
