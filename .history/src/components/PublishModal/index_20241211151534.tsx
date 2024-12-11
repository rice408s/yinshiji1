import { View, Button } from '@tarojs/components'
import { showToast, cloud } from '@tarojs/taro'
import { useState } from 'react'
import Header from './Header'
import ImageUploader from './ImageUploader'
import DescriptionInput from './DescriptionInput'
import FoodCard from './FoodCard'
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

          if (analysisResult.msg === 'success' && analysisResult.food) {
            showToast({
              title: `识别成功：${analysisResult.food}`,
              icon: 'success'
            })

            setTimeout(() => {
              onClose()
              setFileID('')
              setDescription('')
            }, 1500)
          } else {
            showToast({
              title: '未能识别食物，请重试',
              icon: 'error'
            })
          }
        } catch (err) {
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
        <Header />
        <ImageUploader onImageUploaded={setFileID} />
        <DescriptionInput value={description} onChange={setDescription} />
        <Button
          className='submit-btn'
          onClick={handleSubmit}
          disabled={!fileID || isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting ? '识别中...' : '开始扫描'}
        </Button>
      </View>
    </View>
  )
}
