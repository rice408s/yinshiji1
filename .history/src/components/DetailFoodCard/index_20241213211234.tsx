import { View, Text, Image } from '@tarojs/components'
import './index.scss'

interface Nutrients {
  calories?: number
  protein?: number
  fat?: number
  carbs?: number
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
      <View className='food-image'>
        <Image
          src={imageUrl}
          mode='aspectFill'
          className='image'
        />
      </View>

      <View className='food-info'>
        <View className='food-name'>
          <Text className='name'>{food}</Text>
          <Text className='amount'>{count}{unit}</Text>
        </View>

        <View className='nutrients-grid'>
          <View className='nutrient-item'>
            <Text className='value'>{nutrients.calories || 0}</Text>
            <Text className='label'>热量(千卡)</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='value'>{nutrients.protein || 0}</Text>
            <Text className='label'>蛋白质(克)</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='value'>{nutrients.fat || 0}</Text>
            <Text className='label'>脂肪(克)</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='value'>{nutrients.carbs || 0}</Text>
            <Text className='label'>碳水(克)</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
