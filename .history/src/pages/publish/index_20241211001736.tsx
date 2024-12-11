import { View, Text, Button, Image, Textarea } from '@tarojs/components'
import Taro, { chooseImage, showToast } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

export default function Publish() {
  const [selectedImage, setSelectedImage] = useState('')
  const [description, setDescription] = useState('')

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
      setTimeout(() => {
        Taro.switchTab({  // 使用 switchTab 返回首页
          url: '/pages/index/index'
        })
      }, 1500)
    } catch (err) {
      console.error('发布失败:', err)
      showToast({ title: '发布失败', icon: 'error' })
    }
  }

  const handleClose = () => {
    Taro.switchTab({  // 使用 switchTab 返回首页
      url: '/pages/index/index'
    })
  }

  return (
    <View className='publish-mask' style={{ backgroundColor: 'transparent' }}>
      <View className='mask-content'>
        <View className='mask-header'>
          <Text className='title'>发布美食</Text>
          <Text className='close' onClick={handleClose}>×</Text>
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
  )
}
