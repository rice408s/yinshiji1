import { View, Text, Button, Textarea, Image } from '@tarojs/components'
import { showToast, cloud, chooseImage } from '@tarojs/taro'
import { useState } from 'react'
import Header from './Header'
import NutritionCard from './NutritionCard/index'
import EditFoodModal from './EditFoodModal'
import './index.scss'

interface Props {
  visible: boolean
  onClose: (isComplete: boolean) => void
}

interface FoodAnalysisResult {
  food: string
  count?: number
  unit?: string
  time?: string
  nutrients?: {
    calories: number
    carbohydrates: number
    protein: number
    fat: number
  }
}

export default function PublishModal({ visible, onClose }: Props) {
  const [description, setDescription] = useState('')
  const [fileID, setFileID] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [foodData, setFoodData] = useState<FoodAnalysisResult | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [showNutrition, setShowNutrition] = useState(false)

  const resetState = () => {
    setDescription('')
    setFileID('')
    setFoodData(null)
    setImageUrl('')
    setPreviewImage('')
    setIsSubmitting(false)
    setShowNutrition(false)
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

  const analyzeNutrition = async (foodData: FoodAnalysisResult) => {
    try {
      const { result } = await cloud.callFunction({
        name: 'doubao',
        data: {
          action: 'nutrition',
          foodData
        }
      }) as any

      console.log('营养分析结果:', result)
      return result
    } catch (err) {
      console.error('营养分析失败:', err)
      return null
    }
  }

  const handleSave = async () => {
    if (!foodData || !fileID) return

    try {
      setIsSubmitting(true)

      // 先进行营养分析
      const nutritionResult = await analyzeNutrition(foodData)

      // 组装完整的卡片数据并更新 foodData
      const updatedFoodData = {
        ...foodData,
        nutrients: nutritionResult?.data
      }
      setFoodData(updatedFoodData)
      setShowNutrition(true)
      setIsSubmitting(false)

      console.log('完整的卡片数据:', {
        fileID,
        imageUrl,
        description,
        ...updatedFoodData
      })
    } catch (err) {
      console.error('营养分析失败:', err)
      showToast({
        title: '营养分析失败',
        icon: 'error'
      })
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

      console.log('图片上传成功:', uploadResult.data)

      const { result } = await cloud.callFunction({
        name: 'doubao',
        data: {
          imageUrl: uploadResult.data.url,
          prompt: description || undefined
        }
      }) as any

      if (result.code === 200 && result.data) {
        const analysisResult = result.data
        const now = new Date()
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

        if (analysisResult.food) {
          const foodDataWithTime = {
            ...analysisResult,
            time: currentTime
          }

          console.log('识别结果:', analysisResult)

          setFoodData(foodDataWithTime)
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

  const handleDelete = () => {
    // 重置所有状态
    setFoodData(null)
    setImageUrl('')
    setFileID('')
    setDescription('')
    setPreviewImage('')
    setIsSubmitting(false)
  }

  const handleChooseImage = async () => {
    if (isSubmitting) return
    try {
      const res = await chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album']
      })

      if (!res || !res.tempFilePaths?.length) {
        return
      }

      const tempPath = res.tempFilePaths[0]
      setPreviewImage(tempPath)
      setIsSubmitting(true)

      try {
        const uploadRes = await cloud.uploadFile({
          cloudPath: `food/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`,
          filePath: tempPath
        })

        const { result } = await cloud.callFunction({
          name: 'food',
          data: {
            action: 'uploadImage',
            fileID: uploadRes.fileID
          }
        }) as any

        if (result.code === 200) {
          setFileID(uploadRes.fileID)
        } else {
          throw new Error(result.message)
        }
      } catch (err) {
        console.error('上传图片失败:', err)
        setPreviewImage('')
        showToast({ title: '上传图片失败', icon: 'error' })
      }
    } catch (err) {
      if (err.errMsg !== 'chooseImage:fail cancel') {
        console.error('选择图片失败:', err)
        showToast({ title: '选择图片失败', icon: 'error' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = () => {
    setEditModalVisible(true)
  }

  const handleEditSave = (editedData: FoodAnalysisResult) => {
    setFoodData(editedData)
    setEditModalVisible(false)
  }

  const handleSubmitFinal = async () => {
    if (!foodData || !fileID) return

    try {
      setIsSubmitting(true)
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

  if (!visible) return null

  return (
    <View className='publish-modal' onClick={handleMaskClick}>
      <View className='content' onClick={handleContentClick}>
        <Header />
        <View className='scrollable-content'>
          {foodData ? (
            <>
              <Image
                className='preview-image'
                src={imageUrl}
                mode='aspectFill'
              />
              <NutritionCard data={foodData} />
            </>
          ) : (
            previewImage && (
              <View className='preview-section'>
                <Image
                  className='preview-image'
                  src={previewImage}
                  mode='aspectFill'
                />
                <View className='delete-btn' onClick={handleDelete}>
                  <Text className='icon'>×</Text>
                </View>
              </View>
            )
          )}
        </View>

        {foodData ? (
          <Button
            className='submit-btn save-btn'
            onClick={handleSave}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? '分析中...' : '继续'}
          </Button>
        ) : (
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
        )}
      </View>

      <EditFoodModal
        visible={editModalVisible}
        data={foodData || { food: '' }}
        onClose={() => setEditModalVisible(false)}
        onSave={handleEditSave}
      />
    </View>
  )
}
