import { View, Text, Image } from '@tarojs/components'
import { chooseImage, showToast, cloud, getFileSystemManager } from '@tarojs/taro'
import { useState } from 'react'
import uploadIcon from '../../assets/images/upload.png'  // 添加上传图标
import Loading from '../Loading'  // 添加 Loading 组件

interface Props {
  onImageUploaded: (fileID: string) => void
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
        // 使用 cloud.uploadFile 而不是 uploadFile
        const uploadRes = await cloud.uploadFile({
          cloudPath: `food/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
          filePath: tempFilePaths[0]
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
