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
          </View>
          <View className='food-info'>
            <Text className='food-amount'>
              {count} {unit}
            </Text>
            {nutrients?.calories !== undefined && (
              <Text className='calories'>{nutrients.calories}kcal</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default FoodGridCard
