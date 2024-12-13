import { View, Text, Image } from '@tarojs/components'
import './FoodCard.scss'

// 简化的食物数据接口
interface FoodData {
  food: string
  count?: number
  unit?: string
  time?: string
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
  onEdit?: () => void
}

export default function FoodCard({ imageUrl, data, onDelete, onEdit }: Props) {
  return (
    <View className='food-card'>
      <View className='card-header'>
        <Image className='food-image' src={imageUrl} mode='aspectFill' />
        <View className='delete-btn' onClick={onDelete}>
          <Text className='icon'>×</Text>
        </View>
      </View>

      <View className='card-content'>
        <View className='food-info' onClick={onEdit}>
          <View className='food-name'>{data.food}</View>
          <View className='food-details'>
            {data.count && (
              <Text className='food-amount'>
                {data.count}{data.unit || '份'}
              </Text>
            )}
            {data.time && (
              <Text className='food-time'>{data.time}</Text>
            )}
          </View>
        </View>

        {data.nutrients && (
          <View className='nutrients-grid'>
            <View className='nutrient-item'>
              <Text className='label'>热量</Text>
              <Text className='value'>{data.nutrients.calories}</Text>
              <Text className='unit'>kcal</Text>
            </View>
            <View className='nutrient-item'>
              <Text className='label'>碳水</Text>
              <Text className='value'>{data.nutrients.carbohydrates}</Text>
              <Text className='unit'>g</Text>
            </View>
            <View className='nutrient-item'>
              <Text className='label'>蛋白质</Text>
              <Text className='value'>{data.nutrients.protein}</Text>
              <Text className='unit'>g</Text>
            </View>
            <View className='nutrient-item'>
              <Text className='label'>脂肪</Text>
              <Text className='value'>{data.nutrients.fat}</Text>
              <Text className='unit'>g</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

