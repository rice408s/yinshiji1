import { View, Text, Image } from '@tarojs/components'
import './index.scss'

interface Nutrients {
  calories?: number
  carbohydrates?: number
  protein?: number
  fat?: number
}

interface DetailFoodCardProps {
  imageUrl: string
  food: string
  count: number
  unit: string
  nutrients: Nutrients
}

export default function DetailFoodCard({
  imageUrl,
  food,
  count,
  unit,
  nutrients
}: DetailFoodCardProps) {
  return (
    <View className='detail-food-card'>
      <View className='food-header'>
        <Image
          src={imageUrl}
          mode='aspectFill'
          className='food-image'
        />
        <View className='food-overlay'>
          <View className='food-title'>
            <Text className='name'>{food}</Text>
            <Text className='amount'>{count}{unit}</Text>
          </View>
        </View>
      </View>

      <View className='nutrients-container'>
        <Text className='section-title'>营养成分</Text>
        <View className='nutrients-grid'>
          <View className='nutrient-item'>
            <Text className='value'>{nutrients.calories || 0}</Text>
            <Text className='label'>卡路里</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='value'>{nutrients.protein || 0}g</Text>
            <Text className='label'>蛋白质</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='value'>{nutrients.fat || 0}g</Text>
            <Text className='label'>脂肪</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='value'>{nutrients.carbohydrates || 0}g</Text>
            <Text className='label'>碳水</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
