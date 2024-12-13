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
}

const FoodGridCard: React.FC<Props> = ({
  imageUrl,
  food,
  count,
  unit,
  nutrients,
  onClick
}) => {
  return (
    <View className='food-card' onClick={onClick}>
      <View className='card-main'>
        <Image
          className='food-image'
          src={imageUrl}
          mode='aspectFill'
          lazyLoad
        />
        <View className='content'>
          <View className='food-title'>
            <Text className='food-name'>{food}</Text>
            {(count || unit) && (
              <Text className='food-amount'>
                {count} {unit}
              </Text>
            )}
          </View>
          {nutrients?.calories !== undefined && (
            <View className='calories'>
              <Text className='icon'>🔥</Text>
              <Text className='value'>{nutrients.calories}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default FoodGridCard
