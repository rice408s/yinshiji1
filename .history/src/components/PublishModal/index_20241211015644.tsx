import { View, Text, Button, Image, Textarea } from '@tarojs/components'
import Taro, { chooseImage, showToast, cloud, compressImage, getFileSystemManager } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

interface Props {
  visible: boolean
  onClose: () => void
}

const MAX_SIZE = 1024 * 1024  // 1MB
const MIN_QUALITY = 20  // 最低压缩质量
const MAX_UPLOAD_SIZE = 30 * 1024 * 1024  // 30MB 上传限制

const getFileSize = (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const fs = getFileSystemManager()
    fs.getFileInfo({
      filePath,
      success: (res) => resolve(res.size),
      fail: (err) => reject(err)
    })
  })
}

export default function PublishModal({ visible, onClose }: Props) {
  const [selectedImage, setSelectedImage] = useState('')  // 用于显示的图片路径
  const [description, setDescription] = useState('')
  const [fileID, setFileID] = useState('')  // 云存储文件ID
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!visible) return null

  const handleContentClick = (e: any) => {
    e.stopPropagation()
  }

  // 压缩图片到指定大小
  const compressToSize = async (filePath: string, maxSize: number): Promise<string> => {
    let quality = 80
    let compressedPath = filePath

    while (quality >= MIN_QUALITY) {
      try {
        // 压缩图片
        const compressRes = await compressImage({
          src: filePath,
          quality
        })

        // 使用新的 API 获取文件大小
        const size = await getFileSize(compressRes.tempFilePath)

        if (size <= maxSize) {
          console.log(`压缩成功: ${size / 1024}KB, quality: ${quality}`)
          return compressRes.tempFilePath
        }

        // 如果还是太大，降低质量继续压缩
        quality -= 10
        compressedPath = compressRes.tempFilePath
      } catch (err) {
        console.error('压缩图片失败:', err)
        throw err
      }
    }

    // 如果压缩到最低质量还是太大，使用最后一次压缩的结果
    return compressedPath
  }

  const handleChooseImage = async () => {
    try {
      const res = await chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album']
      })

      const tempPath = res.tempFilePaths[0]

      // 检查文件大小
      const originalSize = await getFileSize(tempPath)
      console.log(`原始图片大小: ${(originalSize / 1024 / 1024).toFixed(2)}MB`)

      if (originalSize > MAX_UPLOAD_SIZE) {
        showToast({
          title: '图片太大，请选择30MB以下的图片',
          icon: 'none',
          duration: 2000
        })
        return
      }

      // 立即显示选中的图片
      setSelectedImage(tempPath)
      setIsUploading(true)

      const startTime = Date.now()  // 开始计时

      try {
        // 在后台压缩和上传图片，但不更新显示
        const filePath = originalSize <= MAX_SIZE
          ? tempPath
          : await compressToSize(tempPath, MAX_SIZE)

        const uploadRes = await cloud.uploadFile({
          cloudPath: `food/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`,
          filePath
        })

        const { result } = await cloud.callFunction({
          name: 'food',
          data: {
            action: 'uploadImage',
            fileID: uploadRes.fileID
          }
        }) as any

        if (result.code === 200) {
          const endTime = Date.now()  // 结束计时
          const duration = ((endTime - startTime) / 1000).toFixed(2)  // 计算耗时（秒）

          // 只保存文件ID，不更新显示的图片
          setFileID(result.data.fileID)
          // 打印压缩后的图片URL和耗时
          console.log('上传成功，耗时:', duration, '秒')
          console.log('压缩图片URL:', result.data.url)
        } else {
          throw new Error(result.message)
        }
      } catch (err) {
        console.error('上传图片失败:', err)
        setSelectedImage('')
        showToast({ title: '上传图片失败', icon: 'error' })
      }
    } catch (err) {
      console.error('选择图片失败:', err)
      showToast({ title: '选择图片失败', icon: 'error' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = async () => {
    // 立即删除显示的图片
    const oldFileID = fileID
    setSelectedImage('')
    setFileID('')

    // 静默删除云存储图片
    if (oldFileID) {
      try {
        await cloud.callFunction({
          name: 'food',
          data: {
            action: 'deleteImage',
            fileID: oldFileID
          }
        })
      } catch (err) {
        console.error('删除云存储图片失败:', err)
        // 静默失败，不显示任何提示
      }
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
                src={selectedImage}  // 始终使用原始图片路径
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
