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
}

const FoodGridCard: React.FC<Props> = ({
  imageUrl,
  food,
  count,
  unit,
  nutrients,
  description,
  createdAt
}) => {
  const formatTime = (date: Date) => {
    const d = new Date(date)
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return (
    <View className='food-card'>
      <View className='card-header'>
        <Text className='time'>{formatTime(createdAt)}</Text>
        {nutrients?.calories && (
          <Text className='calories'>{nutrients.calories} 千卡</Text>
        )}
      </View>

      <View className='card-content'>
        <Image
          className='food-image'
          src={imageUrl}
          mode='aspectFill'
          lazyLoad
        />

        <View className='food-info'>
          <Text className='food-name'>{food}</Text>
          {(count || unit) && (
            <Text className='quantity'>
              {count && count}{unit && unit}
            </Text>
          )}
          {description && (
            <Text className='description'>{description}</Text>
          )}
        </View>
      </View>

      {nutrients && (
        <View className='nutrients-grid'>
          <View className='nutrient-item'>
            <Text className='label'>碳水</Text>
            <Text className='value'>{nutrients.carbohydrates}g</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='label'>蛋白质</Text>
            <Text className='value'>{nutrients.protein}g</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='label'>脂肪</Text>
            <Text className='value'>{nutrients.fat}g</Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default FoodGridCard
