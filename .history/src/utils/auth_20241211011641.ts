import Taro from '@tarojs/taro'

const USER_INFO_KEY = 'user_info'
const LOGIN_TIME_KEY = 'login_time'

// 保存用户信息到本地
export const setUserInfo = (userInfo: any) => {
  try {
    Taro.setStorageSync(USER_INFO_KEY, userInfo)
    Taro.setStorageSync(LOGIN_TIME_KEY, Date.now())
    console.log('本地存储 - 保存用户信息成功:', userInfo)
  } catch (err) {
    console.error('本地存储 - 保存用户信息失败:', err)
  }
}

// 获取本地用户信息
export const getUserInfo = () => {
  try {
    const userInfo = Taro.getStorageSync(USER_INFO_KEY)
    const loginTime = Taro.getStorageSync(LOGIN_TIME_KEY)

    if (userInfo && loginTime) {
      return userInfo
    }
    return null
  } catch (err) {
    console.error('本地存储 - 获取用户信息失败:', err)
    return null
  }
}

// 检查是否已登录
export const checkIsLoggedIn = () => {
  try {
    const userInfo = Taro.getStorageSync(USER_INFO_KEY)
    const loginTime = Taro.getStorageSync(LOGIN_TIME_KEY)

    if (userInfo && loginTime) {
      return true
    }
    return false
  } catch (err) {
    console.error('本地存储 - 检查登录状态失败:', err)
    return false
  }
}

// 清除本地用户信息
export const clearUserInfo = () => {
  try {
    Taro.removeStorageSync(USER_INFO_KEY)
    Taro.removeStorageSync(LOGIN_TIME_KEY)
    console.log('本地存储 - 清除用户信息成功')
  } catch (err) {
    console.error('本地存储 - 清除用户信息失败:', err)
  }
}
