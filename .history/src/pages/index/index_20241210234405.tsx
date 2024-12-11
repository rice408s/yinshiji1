import { View, Text, Button, Image, Textarea } from '@tarojs/components'
import Taro, { useLoad, chooseImage, showToast } from '@tarojs/taro'
import { useState } from 'react'
import { checkIsLoggedIn, getUserInfo } from '../../utils/auth'
import { CloudResponse } from '../../types/cloud'
import './index.scss'

interface FoodRecord {
  imageUrl: string
  description: string
  nutrition: {
    calories?: number
    protein?: number
    fat?: number
    carbs?: number
    [key: string]: number | undefined
  }
  aiAnalysis: string
  createTime: string
}

export default function Index() {
  const [showUploadMask, setShowUploadMask] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [description, setDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [foodRecord, setFoodRecord] = useState<FoodRecord | null>(null)

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

  const handleAnalyze = async () => {
    if (!selectedImage) {
      showToast({ title: '请先选择图片', icon: 'none' })
      return
    }

    try {
      setAnalyzing(true)

      // 调用云函数进行分析
      const { result } = (await Taro.cloud.callFunction({
        name: 'analyzeFood',
        data: {
          image: selectedImage,
          description
        }
      }) as unknown) as CloudResponse

      if (result.code === 200) {
        setFoodRecord(result.data.foodRecord)
        showToast({ title: '分析完成', icon: 'success' })
      } else {
        throw new Error(result.message)
      }
    } catch (err: any) {
      console.error('分析失败:', err)
      showToast({
        title: err.message || '分析失败',
        icon: 'error'
      })
    } finally {
      setAnalyzing(false)
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

  return (
    <View className='index'>
      {/* 原有的首页内容 */}

      {/* 上传遮罩 */}
      {showUploadMask && (
        <View className='upload-mask'>
          <View className='mask-content'>
            <View className='mask-header'>
      {/* 拍照/上传区域 */}
      <View className='photo-section'>
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

      {/* 描述输入区域 */}
      <View className='input-section'>
        <Textarea
          className='description-input'
          value={description}
          onInput={e => setDescription(e.detail.value)}
          placeholder='添加描述（可选）'
          maxlength={200}
        />
      </View>

      {/* 分析按钮 */}
      <Button
        className='analyze-btn'
        onClick={handleAnalyze}
        loading={analyzing}
        disabled={!selectedImage || analyzing}
      >
        开始分析
      </Button>

      {/* 分析结果展示 */}
      {foodRecord && (
        <View className='result-section'>
          <View className='nutrition-info'>
            <Text className='title'>营养成分</Text>
            <View className='nutrition-grid'>
              {Object.entries(foodRecord.nutrition).map(([key, value]) => (
                <View className='nutrition-item' key={key}>
                  <Text className='label'>{key}</Text>
                  <Text className='value'>{value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className='ai-analysis'>
            <Text className='title'>AI 分析</Text>
            <Text className='content'>{foodRecord.aiAnalysis}</Text>
          </View>
        </View>
      )}
    </View>
  )
}
