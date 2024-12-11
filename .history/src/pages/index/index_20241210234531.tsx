import { View, Text, ScrollView, Button, Image, Textarea } from '@tarojs/components'
import Taro, { useLoad, redirectTo, cloud, chooseImage, showToast } from '@tarojs/taro'
import { useState } from 'react'
import { checkIsLoggedIn, getUserInfo, setUserInfo, clearUserInfo } from '../../utils/auth'
import { CloudResponse } from '../../types/cloud'
import './index.scss'

export default function Index() {
  const [showUploadMask, setShowUploadMask] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [description, setDescription] = useState('')

  // 处理底部 TabBar 点击
  Taro.useTabItemTap(({ index }) => {
    if (index === 1) { // 中间的拍照按钮
      setShowUploadMask(true)
    }
  })

  const handleChooseImage = async () => {
    try {
      const res = await chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album']
      })

      setSelectedImage(res.tempFilePaths[0])
    } catch (err) {
      console.error('选择图片失败:', err)
    }
  }

  const handleSubmit = async () => {
    if (!selectedImage) {
      showToast({ title: '请先选择图片', icon: 'none' })
      return
    }

    try {
      // 处理提交逻辑
      showToast({ title: '发布成功', icon: 'success' })
      setShowUploadMask(false)
      setSelectedImage('')
      setDescription('')
    } catch (err) {
      console.error('发布失败:', err)
      showToast({ title: '发布失败', icon: 'error' })
    }
  }

  useLoad(async () => {
    // 检查本地登录状态
    const localUserInfo = getUserInfo()
    console.log('首页加载 - 本地用户信息:', localUserInfo)

    if (!checkIsLoggedIn()) {
      console.log('首页加载 - 未登录，跳转登录页')
      redirectTo({ url: '/pages/login/index' })
      return
    }

    try {
      console.log('首页加载 - 验证服务器登录状态')
      const { result } = (await cloud.callFunction({
        name: 'user',
        data: { action: 'checkLogin' }
      }) as unknown) as CloudResponse

      console.log('首页加载 - 服务器返回:', result)

      if (result.code === 200) {
        console.log('首页加载 - 登录有效，更新用户信息')
        const updatedUserInfo = {
          ...result.data.user,
          isLoggedIn: true
        }
        setUserInfo(updatedUserInfo)
      } else {
        console.log('首页加载 - 登录失效，清除状态')
        clearUserInfo()
        redirectTo({ url: '/pages/login/index' })
      }
    } catch (err) {
      console.error('首页加载 - 验证登录状态失败:', err)
      clearUserInfo()
      redirectTo({ url: '/pages/login/index' })
    }
  })

  return (
    <View className='index'>
      {/* 顶部搜索栏 */}
      <View className='search-bar'>
        <View className='search-input'>
          <Text className='placeholder'>搜索</Text>
        </View>
      </View>

      {/* 功能导航 */}
      <View className='nav-grid'>
        <View className='nav-item'>
          <Text className='nav-text'>功能1</Text>
        </View>
        <View className='nav-item'>
          <Text className='nav-text'>功能2</Text>
        </View>
        <View className='nav-item'>
          <Text className='nav-text'>功能3</Text>
        </View>
        <View className='nav-item'>
          <Text className='nav-text'>功能4</Text>
        </View>
      </View>

      {/* 内容列表 */}
      <View className='content-list'>
        <View className='content-item'>
          <View className='content-info'>
            <Text className='title'>内容标题1</Text>
            <Text className='desc'>内容描述...</Text>
          </View>
        </View>
        <View className='content-item'>
          <View className='content-info'>
            <Text className='title'>内容标题2</Text>
            <Text className='desc'>内容描述...</Text>
          </View>
        </View>
      </View>

      {/* 上传遮罩 */}
      {showUploadMask && (
        <View className='upload-mask'>
          <View className='mask-content'>
            <View className='mask-header'>
              <Text className='title'>发布美食</Text>
              <Text className='close' onClick={() => setShowUploadMask(false)}>×</Text>
            </View>

            <View className='upload-section'>
              {selectedImage ? (
                <Image
                  className='preview-image'
                  src={selectedImage}
                  mode='aspectFit'
                  onClick={handleChooseImage}
                />
              ) : (
                <Button
                  className='upload-btn'
                  onClick={handleChooseImage}
                >
                  <Text className='icon'>📸</Text>
                  <Text className='text'>拍照或选择图片</Text>
                </Button>
              )}
            </View>

            <View className='input-section'>
              <Textarea
                className='description-input'
                value={description}
                onInput={e => setDescription(e.detail.value)}
                placeholder='添加美食描述...'
                maxlength={200}
              />
            </View>

            <Button
              className='submit-btn'
              onClick={handleSubmit}
              disabled={!selectedImage}
            >
              发布
            </Button>
          </View>
        </View>
      )}
    </View>
  )
}
