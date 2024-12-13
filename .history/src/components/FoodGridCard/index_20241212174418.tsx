import { View, Image, Text } from '@tarojs/components'
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
  showDate
}: Props) {
  const formatDate = (date: Date) => {
    return {
      day: date.getDate(),
      month: `${date.getMonth() + 1}月`
    }
  }

  const { day, month } = formatDate(createdAt)
  const time = createdAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  return (
    <View className='food-record'>
      {showDate && (
        <View className='date-label'>
          <Text className='day'>{day}</Text>
          <Text className='month'>{month}</Text>
        </View>
      )}
      <View className='food-card'>
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
