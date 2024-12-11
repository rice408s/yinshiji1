import { View, Button } from '@tarojs/components'
import { showToast, cloud } from '@tarojs/taro'
import { useState } from 'react'
import Header from './Header'
import ImageUploader from './ImageUploader'
import DescriptionInput from './DescriptionInput'
import './index.scss'

interface Props {
  visible: boolean
  onClose: () => void
}

interface FoodAnalysisResult {
  msg: string;
  food?: string;
  count?: number;
  unit?: string;
  nutrients?: {
    calories: number;      // 热量
    carbohydrates: number; // 碳水化合物
    protein: number;       // 蛋白质
    fat: number;          // 脂肪
  };
}

export default function PublishModal({ visible, onClose }: Props) {
  const [description, setDescription] = useState('')
  const [fileID, setFileID] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!visible) return null

  const handleContentClick = (e: any) => {
    e.stopPropagation()
  }

  const handleSubmit = async () => {
    if (!fileID) {
      showToast({ title: '请先选择图片', icon: 'none' })
      return
    }

    try {
      setIsSubmitting(true)

      const { result: uploadResult } = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'uploadImage',
          fileID
        }
      }) as any

      if (uploadResult?.code !== 200 || !uploadResult?.data?.url) {
        throw new Error('获取图片URL失败')
      }

      const { result } = await cloud.callFunction({
        name: 'tongyi',
        data: {
          user_input: description || '分析图中的食物',
          image_url: uploadResult.data.url
        }
      }) as any

      if (result.code === 200 && result.data && result.data.res) {
        try {
          const firstParse = JSON.parse(result.data.res)
          const analysisResult: FoodAnalysisResult = firstParse.res ? JSON.parse(firstParse.res) : firstParse
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

      try {
        // 压缩图片
        const filePath = originalSize <= MAX_SIZE
          ? tempPath
          : await compressToSize(tempPath, MAX_SIZE)

        // 上传到云存储
        const uploadRes = await cloud.uploadFile({
          cloudPath: `food/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`,
          filePath
        })

        // 获取图片URL
        const { result } = await cloud.callFunction({
          name: 'food',
          data: {
            action: 'uploadImage',
            fileID: uploadRes.fileID
          }
        }) as any

        if (result.code === 200) {
          setFileID(result.data.fileID)
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
    if (!selectedImage || !fileID) {
      showToast({ title: '请先选择图片', icon: 'none' })
      return
    }

    try {
      setIsSubmitting(true)

      // 先获取图片URL
      const { result: uploadResult } = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'uploadImage',
          fileID
        }
      }) as any

      if (!uploadResult?.code === 200 || !uploadResult?.data?.url) {
        throw new Error('获取图片URL失败')
      }

      // 调用通义云函数
      const { result } = await cloud.callFunction({
        name: 'tongyi',
        data: {
          user_input: description || '分析图中的食物',
          image_url: uploadResult.data.url  // 使用获取到的URL
        }
      }) as any

      console.log('发送到云函数的参数:', {
        user_input: description || '分析图中的食物',
        image_url: uploadResult.data.url
      })

      // 打印原始返回数据以便调试
      console.log('云函数返回:', result)

      if (result.code === 200 && result.data && result.data.res) {
        try {
          // 解析第一层 JSON 字符串
          const firstParse = JSON.parse(result.data.res)
          // 如果 res 是字符串，再解析一次
          const analysisResult: FoodAnalysisResult = firstParse.res ? JSON.parse(firstParse.res) : firstParse

          if (analysisResult.msg === 'success' && analysisResult.food) {
            showToast({
              title: `识别成功：${analysisResult.food}`,
              icon: 'success'
            })

            // 打印详细结果
            console.log('识别结果:', {
              食物: analysisResult.food,
              数量: `${analysisResult.count}${analysisResult.unit}`,
              营养成分: {
                热量: `${analysisResult.nutrients?.calories}千卡`,
                碳水化合物: `${analysisResult.nutrients?.carbohydrates}克`,
                蛋白质: `${analysisResult.nutrients?.protein}克`,
                脂肪: `${analysisResult.nutrients?.fat}克`
              }
            })

            setTimeout(() => {
              onClose()
              setSelectedImage('')
              setFileID('')
              setDescription('')
            }, 1500)
          } else {
            console.error('识别结果无效:', analysisResult)
            showToast({
              title: '未能识别食物，请重试',
              icon: 'error'
            })
          }
        } catch (err) {
          console.error('解析结果失败:', err, '原始数据:', result.data.res)
          showToast({
            title: '识别结果解析失败',
            icon: 'error'
          })
        }
      } else {
        throw new Error(result.message || '识别失败')
      }
    } catch (err) {
      console.error('识别失败:', err)
      showToast({
        title: '识别服务异常',
        icon: 'error'
      })
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
