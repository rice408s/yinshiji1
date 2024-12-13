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

const FoodGridCard: React.FC<Props> = ({
  imageUrl,
  food,
  count,
  unit,
  nutrients,
  createdAt,
  onClick,
  showDate = false
}) => {
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return { month, day }
  }

  const date = formatDate(new Date(createdAt))

  return (
    <View className='food-record'>
      {showDate && (
        <View className='date-label'>
          <Text className='day'>{date.day}</Text>
          <Text className='month'>{date.month}月</Text>
        </View>
      )}
      <View className={`food-card ${!showDate ? 'no-date' : ''}`} onClick={onClick}>
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
              <Text className='time'>{formatTime(new Date(createdAt))}</Text>
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

export default FoodGridCard
