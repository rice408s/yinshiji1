import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface Props {
  imageUrl: string
  food: string
  count?: number
  unit?: string
  nutrients?: {
    calories: number
    carbohydrates: number
    protein: number
    fat: number
  }
  description?: string
  createdAt: Date
  onClick?: () => void
  showDate?: boolean
}

export default function FoodGridCard({
  imageUrl,
  food,
  count,
  unit,
  nutrients,
  createdAt,
  showDate,
  id
}: Props & { id: string }) {
  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    // 转换为日期字符串进行比较（忽略时间）
    const dateStr = date.toISOString().split('T')[0]
    const todayStr = today.toISOString().split('T')[0]
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (dateStr === todayStr) {
      return '今天'
    } else if (dateStr === yesterdayStr) {
      return '昨天'
    } else {
      // 格式化为 MM/DD
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${month}/${day}`
    }
  }

  const day = formatDate(createdAt)
  const time = createdAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  const handleClick = () => {
    if (!id) {
      console.error('记录ID不存在')
      return
    }

    Taro.navigateTo({
      url: `/pages/record/index?id=${id}`,
      fail: (err) => {
        console.error('页面跳转失败:', err)
        Taro.showToast({
          title: '页面跳转失败',
          icon: 'none'
        })
      }
    })
  }

  return (
    <View className='food-record'>
      {showDate && (
        <View className='date-label'>
          <Text className='day'>{day}</Text>
        </View>
      )}
      <View className='food-card' onClick={handleClick}>
        <View className='card-main'>
          <Image
            className='food-image'
            src={imageUrl}
            mode='aspectFill'
            lazyLoad
          />
          <View className='content'>
            <View className='header'>
              <Text className='food-name'>{food}</Text>
              <Text className='time'>{time}</Text>
            </View>
            <View className='info'>
              {(count || unit) && (
                <Text className='food-amount'>
                  {count} {unit}
                </Text>
              )}
              {nutrients?.calories !== undefined && (
                <View className='calories'>
                  <Text className='icon'>🔥</Text>
                  <Text className='value'>{nutrients.calories}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
