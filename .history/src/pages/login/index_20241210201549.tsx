import { View, Text, Button } from '@tarojs/components'
import { useLoad, cloud, navigateTo } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)

      // 调用微信登录
      const { code } = await cloud.callContainer({
        path: '/auth/login',
        method: 'POST'
      })

      // 调用云函数进行登录
      const { result } = await cloud.callFunction({
        name: 'user',
        data: {
          action: 'login',
          code
        }
      })

      if (result.code === 200) {
        // 登录成功,跳转到首页
        navigateTo({
          url: '/pages/index/index'
        })
      }
    } catch (err) {
      console.error('登录失败:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='login'>
      <View className='login-container'>
        <View className='login-header'>
          <Text className='title'>欢迎回来</Text>
          <Text className='subtitle'>登录您的账号以继续</Text>
        </View>

        <Button
          className='login-btn'
          loading={loading}
          onClick={handleLogin}
        >
          微信一键登录
        </Button>

        <View className='login-footer'>
          <Text className='agreement'>
            登录即表示同意
            <Text className='link'>用户协议</Text>
            和
            <Text className='link'>隐私政策</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}