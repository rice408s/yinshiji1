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
  createdAt: Date
}

const FoodGridCard: React.FC<Props> = ({
  imageUrl,
  food,
  count,
  unit,
  nutrients,
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
            <View className='meta'>
              <Text className='time'>{formatTime(createdAt)}</Text>
              {(count || unit) && (
                <Text className='quantity'>
                  {count && count}{unit && unit}
                </Text>
              )}
              {nutrients?.calories && (
                <Text className='calories'>{nutrients.calories}千卡</Text>
              )}
            </View>
          </View>

          {nutrients && (
            <View className='nutrients'>
              <View className='nutrient'>
                <Text className='value carbs'>{nutrients.carbohydrates}</Text>
                <Text className='label'>碳水</Text>
              </View>
              <View className='nutrient'>
                <Text className='value protein'>{nutrients.protein}</Text>
                <Text className='label'>蛋白质</Text>
              </View>
              <View className='nutrient'>
                <Text className='value fat'>{nutrients.fat}</Text>
                <Text className='label'>脂肪</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default FoodGridCard
