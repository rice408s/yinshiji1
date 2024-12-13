import { View, Text, Image } from '@tarojs/components'
import './FoodCard.scss'

interface FoodData {
  food: string
  count?: number
  unit?: string
  nutrients?: {
    calories: number
    carbohydrates: number
    protein: number
    fat: number
  }
}

interface Props {
  imageUrl: string
  data: FoodData
  onDelete?: () => void
}

export default function FoodCard({ imageUrl, data, onDelete }: Props) {
  return (
    <View className='food-card'>
      <View className='food-header'>
        <Image className='food-image' src={imageUrl} mode='aspectFill' />
        <View className='food-info'>
          <Text className='food-name'>{data.food}</Text>
          {(data.count || data.unit) && (
            <Text className='food-amount'>
              {data.count} {data.unit}
            </Text>
          )}
        </View>
        {onDelete && (
          <View className='delete-btn' onClick={onDelete}>
            <Text className='icon'>✕</Text>
          </View>
        )}
      </View>

      {data.nutrients && (
        <View className='nutrients-grid'>
          <View className='nutrient-item calories'>
            <View className='nutrient-label'>
              <Text className='icon'>🔥</Text>
              <Text>热量</Text>
            </View>
            <View className='nutrient-value'>
              <Text className='value'>{data.nutrients.calories}</Text>
              <Text className='unit'>千卡</Text>
            </View>
          </View>

          <View className='nutrient-item protein'>
            <View className='nutrient-label'>
              <Text className='icon'>🥩</Text>
              <Text>蛋白质</Text>
            </View>
            <View className='nutrient-value'>
              <Text className='value'>{data.nutrients.protein}</Text>
              <Text className='unit'>克</Text>
            </View>
          </View>

          <View className='nutrient-item fat'>
            <View className='nutrient-label'>
              <Text className='icon'>🥑</Text>
              <Text>脂肪</Text>
            </View>
            <View className='nutrient-value'>
              <Text className='value'>{data.nutrients.fat}</Text>
              <Text className='unit'>克</Text>
            </View>
          </View>

          <View className='nutrient-item carbs'>
            <View className='nutrient-label'>
              <Text className='icon'>🌾</Text>
              <Text>碳水</Text>
            </View>
            <View className='nutrient-value'>
              <Text className='value'>{data.nutrients.carbohydrates}</Text>
              <Text className='unit'>克</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

