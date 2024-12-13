import Taro from '@tarojs/taro'

// 云函数调用工具
export const cloud = {
  async callFunction({ name, data = {} }) {
    try {
      return await Taro.cloud.callFunction({
        name,
        data
      })
    } catch (err) {
      console.error(`调用云函数 ${name} 失败:`, err)
      throw err
    }
  }
}
