import { View, Text, Button, Image, Textarea } from '@tarojs/components'
import Taro, { useLoad, chooseImage, getSystemInfoSync } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { checkIsLoggedIn, getUserInfo } from '../../utils/auth'
import './index.scss'
import { debugElement } from '../../utils/debug'

interface FoodAnalysis {
  name: string
  calories: number
  protein: number
  fat: number
  carbs: number
  description: string
}

export default function Index() {
  const [userInfo, setUserInfo] = useState(getUserInfo())
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null)

  useLoad(() => {
    if (!checkIsLoggedIn()) {
      Taro.redirectTo({ url: '/pages/login/index' })
    }
  })

  useEffect(() => {
    // 获取状态栏高度
    const systemInfo = getSystemInfoSync()
    setStatusBarHeight(systemInfo.statusBarHeight || 0)
  }, [])

  // 跳转到个人中心
  const handleGoToProfile = () => {
    Taro.navigateTo({ url: '/pages/profile/index' })
  }

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

  // 分析食���
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
        // 清���表单
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

  // 调试函数
  const handleDebug = (e) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('元素信息:', {
        dataset: e.currentTarget.dataset,
        id: e.currentTarget.id,
        offsetLeft: e.currentTarget.offsetLeft,
        offsetTop: e.currentTarget.offsetTop,
        style: window.getComputedStyle(e.currentTarget)
      })

      Taro.getSystemInfo({
        success: (res) => {
          console.log('系统信息:', res)
        }
      })

      // 获取元素信息
      const query = Taro.createSelectorQuery()
      query.select('.some-element').boundingClientRect()
      query.exec((res) => {
        console.log('元素位置和大小:', res[0])
      })
    }
  }

  const handleElementClick = (e) => {
    debugElement(e.currentTarget)
  }

  return (
    <View className='index'>
      {/* 自定义导航栏 */}
      <View
        className='custom-nav'
        style={{ paddingTop: `${statusBarHeight}px` }}
      >
        <View className='nav-content'>
          <View className='avatar-wrapper' onClick={handleGoToProfile}>
            <Image
              className='avatar'
              src={userInfo?.avatarUrl || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'}
              mode='aspectFill'
            />
          </View>
          <Text className='title'>饮食记</Text>
        </View>
      </View>

      {/* 内容区域 */}
      <View className='content-area'>
        {/* 提示文本 */}
        {!imageUrl && !content && !analysis && (
          <View className='empty-tip'>
            <Text className='text'>拍照或输入描述，开始分析食物</Text>
          </View>
        )}

        {/* 预览图片 */}
        {imageUrl && (
          <View className='preview-section'>
            <Image
              className='preview-image'
              src={imageUrl}
              mode='aspectFill'
            />
          </View>
        )}

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

      {/* 底部输入区域 */}
      <View className='input-area'>
        <View className='input-wrapper'>
          <Button className='photo-btn' onClick={handleChooseImage}>
            <Text className='iconfont icon-camera'></Text>
          </Button>
          <View className='input-box'>
            <Textarea
              className='content-input'
              value={content}
              onInput={e => setContent(e.detail.value)}
              placeholder='添加描述...'
              maxlength={200}
              autoHeight
            />
          </View>
          <Button
            className={`send-btn ${(imageUrl || content) ? 'active' : ''}`}
            loading={loading}
            onClick={handleAnalyze}
          >
            分析
          </Button>
        </View>
      </View>

      {/* 给需要调试的元素添加 onClick 事件 */}
      <View
        className='some-element'
        onClick={handleDebug}
        data-name="测试元素"  // 可以添加自定义数据
      >
        点击我查看信息
      </View>

      <View
        className='debug-element'
        onClick={handleElementClick}
      >
        点击查看元素信息
      </View>
    </View>
  )
}
