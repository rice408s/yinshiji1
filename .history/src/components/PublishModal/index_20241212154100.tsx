import { View, Button, Textarea, Text } from '@tarojs/components'
import { showToast, cloud } from '@tarojs/taro'
import { useState } from 'react'
import Header from './Header'
import ImageUploader from './ImageUploader'
import DescriptionInput from './DescriptionInput'
import FoodCard from './FoodCard'
import './index.scss'

interface Props {
  visible: boolean
  onClose: (isComplete: boolean) => void
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
  const [foodData, setFoodData] = useState<FoodAnalysisResult | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const resetState = () => {
    setDescription('')
    setFileID('')
    setFoodData(null)
    setImageUrl('')
    setIsSubmitting(false)
  }

  const handleMaskClick = (e: any) => {
    e.stopPropagation()
    console.log('点击遮罩层，取消操作')
    resetState()
    onClose(false)
  }

  const handleContentClick = (e: any) => {
    e.stopPropagation()
  }

  const handleSave = async () => {
    if (!foodData || !fileID) return

    try {
      setIsSubmitting(true)
      console.log('开始保存记录...')

      const { result } = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'saveRecord',
          fileID,
          foodData,
          description
        }
      }) as any

      if (result.code === 200) {
        console.log('保存成功，触发完成回调')
        showToast({
          title: '保存成功',
          icon: 'success'
        })
        resetState()
        onClose(true)
      } else {
        throw new Error(result.message || '保存失败')
      }
    } catch (err) {
      console.error('保存失败:', err)
      showToast({
        title: '保存失败',
        icon: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
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
        },
        timeout: 20000
      }) as any

      if (result.code === 200 && result.data && result.data.res) {
        try {
          const firstParse = JSON.parse(result.data.res)
          const analysisResult: FoodAnalysisResult = firstParse.res ? JSON.parse(firstParse.res) : firstParse

          if (analysisResult.msg === 'success' && analysisResult.food) {
            setFoodData(analysisResult)
            setImageUrl(uploadResult.data.url)
            showToast({
              title: `识别成功：${analysisResult.food}`,
              icon: 'success'
            })
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

  const handleFoodDataChange = (newData: FoodAnalysisResult) => {
    setFoodData(prev => ({
      ...prev!,
      ...newData
    }))
  }

  const handleDelete = () => {
    // 重置所有状态
    setFoodData(null)
    setImageUrl('')
    setFileID('')  // 清除文件ID
    setDescription('')  // 清除描述文本
    setIsSubmitting(false)  // 重置提交状态
  }

  if (!visible) return null

  return (
    <View className='publish-modal' onClick={handleMaskClick}>
      <View className='content' onClick={handleContentClick}>
        <Header />
        {foodData ? (
          <>
            <FoodCard
              imageUrl={imageUrl}
              data={foodData}
              onDelete={handleDelete}
            />
            <Button
              className='submit-btn save-btn'
              onClick={handleSave}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? '保存中...' : '记录'}
            </Button>
          </>
        ) : (
          <>
            <View className='input-section'>
              <Button
                className={`upload-btn ${isSubmitting ? 'loading' : ''}`}
                onClick={handleChooseImage}
                disabled={isSubmitting}
              >
                {isSubmitting ? '' : <Text className='icon'>📸</Text>}
              </Button>
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
                disabled={isSubmitting}
              />
              <Button
                className={`scan-btn ${isSubmitting ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={!fileID || isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? '' : <Text className='icon'>🔍</Text>}
              </Button>
            </View>
            <ImageUploader
              onImageUploaded={setFileID}
              disabled={isSubmitting}
            />
          </>
        )}
      </View>
    </View>
  )
}
