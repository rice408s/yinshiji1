import { View, Text, Button, Image, Textarea } from '@tarojs/components'
import Taro, { chooseImage, showToast, cloud } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

interface Props {
  visible: boolean
  onClose: () => void
}

export default function PublishModal({ visible, onClose }: Props) {
  const [selectedImage, setSelectedImage] = useState('')
  const [description, setDescription] = useState('')
  const [fileID, setFileID] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!visible) return null

  const handleContentClick = (e: any) => {
    e.stopPropagation()
  }

  const handleChooseImage = async () => {
    try {
      const res = await chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album']
      })

      setIsUploading(true)

      // 上传图片到云存储
      const uploadRes = await cloud.uploadFile({
        cloudPath: `food/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`,
        filePath: res.tempFilePaths[0]
      })

      // 调用云函数处理图片
      const { result } = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'uploadImage',
          fileID: uploadRes.fileID
        }
      }) as any

      if (result.code === 200) {
        setSelectedImage(result.data.url)
        setFileID(result.data.fileID)
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.error('选择/上传图片失败:', err)
      showToast({ title: '上传图片失败', icon: 'error' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = async () => {
    try {
      if (fileID) {
        const { result } = await cloud.callFunction({
          name: 'food',
          data: {
            action: 'deleteImage',
            fileID
          }
        }) as any

        if (result.code === 200) {
          setSelectedImage('')
          setFileID('')
        } else {
          throw new Error(result.message)
        }
      }
    } catch (err) {
      console.error('删除图片失败:', err)
      showToast({ title: '删除图片失败', icon: 'error' })
    }
  }

  const handleSubmit = async () => {
    if (!selectedImage) {
      showToast({ title: '请先选择图片', icon: 'none' })
      return
    }

    try {
      setIsSubmitting(true)
      // TODO: 这里添加识别逻辑

      showToast({ title: '识别成功', icon: 'success' })
      setTimeout(() => {
        onClose()
        setSelectedImage('')
        setFileID('')
        setDescription('')
      }, 1500)
    } catch (err) {
      console.error('识别失败:', err)
      showToast({ title: '识别失败', icon: 'error' })
    } finally {
      setIsSubmitting(false)
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
                  e.stopPropagation()
                  handleDeleteImage()
                }}
              >
                <Text className='icon'>×</Text>
              </View>
            </View>
          ) : (
            <Button
              className='upload-btn'
              onClick={handleChooseImage}
              loading={isUploading}
              disabled={isUploading}
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
          disabled={!selectedImage || isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting ? '识别中...' : '开始扫描'}
        </Button>
      </View>
    </View>
  )
}
