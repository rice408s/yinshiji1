import { View, Text, Button, Image } from '@tarojs/components'
import { chooseImage, showToast, cloud, compressImage, getFileSystemManager } from '@tarojs/taro'
import { useState } from 'react'

interface Props {
  onImageUploaded: (fileID: string) => void
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

export default function ImageUploader({ onImageUploaded }: Props) {
  const [selectedImage, setSelectedImage] = useState('')
  const [fileID, setFileID] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // 压缩图片到指定大小
  const compressToSize = async (filePath: string, maxSize: number): Promise<string> => {
    let quality = 80
    let compressedPath = filePath

    while (quality >= MIN_QUALITY) {
      try {
        const compressRes = await compressImage({
          src: filePath,
          quality
        })

        const size = await getFileSize(compressRes.tempFilePath)

        if (size <= maxSize) {
          return compressRes.tempFilePath
        }

        quality -= 10
        compressedPath = compressRes.tempFilePath
      } catch (err) {
        console.error('压缩图片失败:', err)
        throw err
      }
    }

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
      const originalSize = await getFileSize(tempPath)

      if (originalSize > MAX_UPLOAD_SIZE) {
        showToast({
          title: '图片太大，请选择30MB以下的图片',
          icon: 'none',
          duration: 2000
        })
        return
      }

      setSelectedImage(tempPath)
      setIsUploading(true)

      try {
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
          },
          timeout: 10000
        }) as any

        if (result.code === 200) {
          setFileID(uploadRes.fileID)
          onImageUploaded(uploadRes.fileID)
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
    const oldFileID = fileID
    setSelectedImage('')
    setFileID('')
    onImageUploaded('')

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
      }
    }
  }

  return (
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
          {isUploading && (
            <View className='loading-overlay'>
              <View className='loading-spinner' />
            </View>
          )}
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
  )
}
