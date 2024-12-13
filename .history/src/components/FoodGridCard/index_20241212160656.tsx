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
  createdAt
}) => {
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
          <View className='food-title'>
            <Text className='food-name'>{food}</Text>
            <Text className='food-amount'>
              {count && count} {unit && unit}
            </Text>
          </View>
          {nutrients && (
            <View className='food-nutrients'>
              {nutrients.calories !== undefined && (
                <Text className='calories'>{nutrients.calories}kcal</Text>
              )}
              <Text className='nutrients-detail'>
                {nutrients.protein !== undefined && `蛋白质${nutrients.protein}g、`}
                {nutrients.fat !== undefined && `脂肪${nutrients.fat}g、`}
                {nutrients.carbohydrates !== undefined && `碳水${nutrients.carbohydrates}g`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default FoodGridCard
