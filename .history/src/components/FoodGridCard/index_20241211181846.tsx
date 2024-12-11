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
            <Text className='time'>{formatTime(createdAt)}</Text>
          </View>

          <View className='info'>
            {(count || unit) && (
              <Text className='quantity'>
                {count && count}{unit && unit}
              </Text>
            )}
            {nutrients?.calories && (
              <Text className='calories'>{nutrients.calories}千卡</Text>
            )}
          </View>

          {nutrients && (
            <View className='nutrients'>
              <Text className='nutrient'>碳水 {nutrients.carbohydrates}g</Text>
              <Text className='nutrient'>蛋白 {nutrients.protein}g</Text>
              <Text className='nutrient'>脂肪 {nutrients.fat}g</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default FoodGridCard
