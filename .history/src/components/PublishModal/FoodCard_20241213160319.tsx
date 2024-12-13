import { View, Text, Image } from '@tarojs/components'
import './FoodCard.scss'

interface FoodData {
  food: string
  count?: number
  unit?: string
  time?: string
  // 添加其他可能的字段
  nutrients?: {
    calories?: number
    protein?: number
    fat?: number
    carbs?: number
  }
  description?: string
}

interface Props {
  imageUrl: string
  data: FoodData
  onDelete?: () => void
  onEdit?: () => void
}

export default function FoodCard({ imageUrl, data, onDelete, onEdit }: Props) {
  // 格式化营养成分数据
  const formatNutrient = (value?: number) => {
    if (value === undefined) return '-'
    return value.toFixed(1)
  }

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

      {/* 添加营养成分信息 */}
      {data.nutrients && (
        <View className='nutrients-grid'>
          <View className='nutrient-item'>
            <Text className='label'>热量</Text>
            <Text className='value'>{formatNutrient(data.nutrients.calories)} kcal</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='label'>蛋白质</Text>
            <Text className='value'>{formatNutrient(data.nutrients.protein)} g</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='label'>脂肪</Text>
            <Text className='value'>{formatNutrient(data.nutrients.fat)} g</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='label'>碳水</Text>
            <Text className='value'>{formatNutrient(data.nutrients.carbs)} g</Text>
          </View>
        </View>
      )}

      {/* 添加描述信息 */}
      {data.description && (
        <View className='food-description'>
          <Text className='description-text'>{data.description}</Text>
        </View>
      )}
    </View>
  )
}

