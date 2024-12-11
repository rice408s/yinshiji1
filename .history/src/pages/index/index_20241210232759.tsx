import { View, Text, Button, Image, Textarea } from '@tarojs/components'
import Taro, { useLoad, chooseImage } from '@tarojs/taro'
import { useState } from 'react'
import { checkIsLoggedIn } from '../../utils/auth'
import './index.scss'

interface FoodAnalysis {
  name: string
  calories: number
  protein: number
  fat: number
  carbs: number
  description: string
}

export default function Index() {
  const [imageUrl, setImageUrl] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null)

  useLoad(() => {
    if (!checkIsLoggedIn()) {
      Taro.redirectTo({ url: '/pages/login/index' })
    }
  })

  // 选择或拍摄图片
  const handleChooseImage = async () => {
    try {
      const res = await chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })

      setImageUrl(res.tempFilePaths[0])
    } catch (err) {
      console.error('选择图片失败:', err)
    }
  }

  // 分析食物
  const handleAnalyze = async () => {
    if (!imageUrl && !content) {
      Taro.showToast({
        title: '请拍照或输入描述',
        icon: 'none'
      })
      return
    }

    try {
      setLoading(true)

      // 调用云函数进行分析
      const { result } = await Taro.cloud.callFunction({
        name: 'food',
        data: {
          action: 'analyze',
          imageUrl,
          content
        }
      }) as any

      if (result.code === 200) {
        setAnalysis(result.data)
      } else {
        throw new Error(result.message)
      }
    } catch (err: any) {
      console.error('分析失败:', err)
      Taro.showToast({
        title: err.message || '分析失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  // 保存记录
  const handleSave = async () => {
    if (!analysis) return

    try {
      const { result } = await Taro.cloud.callFunction({
        name: 'food',
        data: {
          action: 'saveRecord',
          record: {
            imageUrl,
            content,
            analysis,
            createTime: new Date()
          }
        }
      }) as any

      if (result.code === 200) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success'
        })
        // 清空表单
        setImageUrl('')
        setContent('')
        setAnalysis(null)
      } else {
        throw new Error(result.message)
      }
    } catch (err: any) {
      console.error('保存失败:', err)
      Taro.showToast({
        title: err.message || '保存失败',
        icon: 'error'
      })
    }
  }

  return (
    <View className='index'>
      {/* 拍照区域 */}
      <View className='photo-section'>
        {imageUrl ? (
          <Image
            className='preview'
            src={imageUrl}
            mode='aspectFill'
            onClick={handleChooseImage}
          />
        ) : (
          <Button className='photo-btn' onClick={handleChooseImage}>
            <Text className='iconfont icon-camera'></Text>
            <Text className='text'>拍照或选择图片</Text>
          </Button>
        )}
      </View>

      {/* 描述输入区 */}
      <View className='input-section'>
        <Textarea
          className='content-input'
          value={content}
          onInput={e => setContent(e.detail.value)}
          placeholder='添加描述...'
          maxlength={200}
        />
      </View>

      {/* 分析按钮 */}
      <Button
        className='analyze-btn'
        loading={loading}
        onClick={handleAnalyze}
      >
        开始分析
      </Button>

      {/* 分析结果 */}
      {analysis && (
        <View className='analysis-section'>
          <View className='food-name'>{analysis.name}</View>
          <View className='nutrition-info'>
            <View className='item'>
              <Text className='label'>热量</Text>
              <Text className='value'>{analysis.calories}千卡</Text>
            </View>
            <View className='item'>
              <Text className='label'>蛋白质</Text>
              <Text className='value'>{analysis.protein}g</Text>
            </View>
            <View className='item'>
              <Text className='label'>脂肪</Text>
              <Text className='value'>{analysis.fat}g</Text>
            </View>
            <View className='item'>
              <Text className='label'>碳水</Text>
              <Text className='value'>{analysis.carbs}g</Text>
            </View>
          </View>
          <View className='description'>{analysis.description}</View>
          <Button className='save-btn' onClick={handleSave}>
            保存记录
          </Button>
        </View>
      )}
    </View>
  )
}
