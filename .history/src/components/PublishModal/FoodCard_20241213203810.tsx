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
      <View className='food-header'>
        <Image className='food-image' src={imageUrl} mode='aspectFill' />
        <View className='food-info'>
          <Text className='food-name'>{data.food}</Text>
          <View className='food-details'>
            {(data.count || data.unit) && (
              <Text className='food-amount'>
                {data.count} {data.unit}
              </Text>
            )}
            {data.time && (
              <Text className='food-time'>
                {data.time}
              </Text>
            )}
          </View>
        </View>
        <View className='action-buttons'>
          {onEdit && (
            <View className='edit-btn' onClick={onEdit}>
              <Text className='icon'>✎</Text>
            </View>
          )}
          {onDelete && (
            <View className='delete-btn' onClick={onDelete}>
              <Text className='icon'>✕</Text>
            </View>
          )}
        </View>
      </View>

      {data.nutrients && (
        <View className='nutrients-info'>
          <View className='nutrient-item'>
            <Text className='label'>热量</Text>
            <Text className='value'>{data.nutrients.calories} kcal</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='label'>碳水</Text>
            <Text className='value'>{data.nutrients.carbohydrates}g</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='label'>蛋白质</Text>
            <Text className='value'>{data.nutrients.protein}g</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='label'>脂肪</Text>
            <Text className='value'>{data.nutrients.fat}g</Text>
          </View>
        </View>
      )}
    </View>
  )
}

