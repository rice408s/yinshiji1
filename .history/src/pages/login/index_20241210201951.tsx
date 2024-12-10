import { View, Text, Button } from '@tarojs/components'
import { cloud, navigateTo, login, showToast } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

interface CloudResponse {
  result: {
    code: number
    message: string
    data?: any
  }
}

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)

      // 获取微信登录凭证
      const { code } = await login()

      // 调用云函数进行登录
      const res = await cloud.callFunction({
        name: 'user',
        data: {
          action: 'login',
          code
        }
      })

      const result = res.result as CloudResponse['result']

      if (result.code === 200) {
        showToast({
          title: '登录成功',
          icon: 'success'
        })

        // 登录成功,跳转到首页
        navigateTo({
          url: '/pages/index/index'
        })
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.error('登录失败:', err)
      showToast({
        title: '登录失败',
        icon: 'error'
      })
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
          openType="getUserInfo"
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
