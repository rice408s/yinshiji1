import { View, Text, Button } from '@tarojs/components'
import Taro, { cloud, showToast, getUserProfile } from '@tarojs/taro'
import { useState } from 'react'
import { setUserInfo } from '../../utils/auth'
import { CloudResponse } from '../../types/cloud'
import './index.scss'

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)

      // 获取用户信息
      const userProfileRes = await getUserProfile({
        desc: '用于完善会员资料'
      })

      // 调用云函数进行登录
      const { result } = (await cloud.callFunction({
        name: 'user',
        data: {
          action: 'login',
          userInfo: userProfileRes.userInfo
        }
      }) as unknown) as CloudResponse

      if (result.code === 200) {
        // 保存用户信息到本地
        setUserInfo(result.data.user)

        showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        })

        // 延迟跳转，让用户看到提示
        setTimeout(() => {
          Taro.navigateTo({
            url: '/pages/index/index'
          })
        }, 2000)
      } else {
        throw new Error(result.message || '登录失败')
      }
    } catch (err: any) {
      console.error('登录失败:', err)
      showToast({
        title: err.message || '登录失败',
        icon: 'error',
        duration: 2000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='login'>
      {/* 品牌展示区域 */}
      <View className='brand-section'>
        <Text className='brand-name'>饮食记</Text>
        <Text className='brand-slogan'>记录美食，分享生活</Text>
      </View>

      {/* 登录卡片 */}
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
            <Text className='link'>隐私��策</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}
