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
  const [isUploading, setIsUploading] = useState(false)

  const handleChooseImage = async () => {
    try {
      const { tempFilePaths } = await chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })

      if (!tempFilePaths?.length) return  // 用户取消选择时直接返回

      setIsUploading(true)

      try {
        const uploadRes = await uploadFile({
          url: 'xxx',
          filePath: tempFilePaths[0],
          name: 'file',
          cloudPath: `food/${Date.now()}-${Math.random().toString(36).slice(2)}`
        })

        const { result } = await cloud.callFunction({
          name: 'food',
          data: {
            action: 'uploadImage',
            fileID: uploadRes.fileID
          }
        }) as any

        if (result.code === 200) {
          onImageUploaded(uploadRes.fileID)
        } else {
          showToast({
            title: '上传失败',
            icon: 'error'
          })
        }
      } catch (err) {
        console.error('上传失败:', err)
        showToast({
          title: '上传失败',
          icon: 'error'
        })
      }
    } catch (err) {
      // 只有在非取消选择的错误时才显示提示
      if (err.errMsg !== 'chooseImage:fail cancel') {
        console.error('选择图片失败:', err)
        showToast({
          title: '选择图片失败',
          icon: 'error'
        })
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <View className='image-uploader' onClick={handleChooseImage}>
      {isUploading ? (
        <View className='uploading'>
          <Loading />
          <Text className='text'>上传中...</Text>
        </View>
      ) : (
        <>
          <Image className='icon' src={uploadIcon} />
          <Text className='text'>点击上传图片</Text>
        </>
      )}
    </View>
  )
}
