import { View, Text, Button, Image, Textarea } from '@tarojs/components'
import Taro, { chooseImage, showToast } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

interface Props {
  visible: boolean
  onClose: () => void
}

export default function PublishModal({ visible, onClose }: Props) {
  const [selectedImage, setSelectedImage] = useState('')
  const [description, setDescription] = useState('')

  if (!visible) return null

  const handleContentClick = (e: any) => {
    // 阻止冒泡，防止点击内容区域时关闭
    e.stopPropagation()
  }

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
        onClose()
        setSelectedImage('')
        setDescription('')
      }, 1500)
    } catch (err) {
      console.error('发布失败:', err)
      showToast({ title: '发布失败', icon: 'error' })
    }
  }

  return (
    <View className='publish-modal' onClick={onClose}>
      <View className='content' onClick={handleContentClick}>
        <View className='header'>
          <View className='title'>
            美食雷达
            <Text className='subtitle'>智能识别 · 探寻美味</Text>
          </View>
        </View>

        <View className='upload-section'>
          {selectedImage ? (
            <View className='preview-container'>
              <Image
                className='preview-image'
                src={selectedImage}
                mode='aspectFill'
                onClick={handleChooseImage}
              />
              <View
                className='delete-btn'
                onClick={(e) => {
                  e.stopPropagation()  // 阻止冒泡
                  setSelectedImage('')
                }}
              >
                <Text className='icon'>×</Text>
              </View>
            </View>
          ) : (
            <Button
              className='upload-btn'
              onClick={handleChooseImage}
            >
              <Text className='icon'>📸</Text>
            </Button>
          )}
        </View>

        <View className='input-section'>
          <Textarea
            className='description-input'
            value={description}
            onInput={e => setDescription(e.detail.value)}
            placeholder='来点灵魂解说...'
            maxlength={200}
            autoHeight
            fixed
            adjustPosition
            holdKeyboard
            showConfirmBar={false}
            cursor-spacing={20}
          />
        </View>

        <Button
          className='submit-btn'
          onClick={handleSubmit}
          disabled={!selectedImage}
        >
          开始扫描
        </Button>
      </View>
    </View>
  )
}
