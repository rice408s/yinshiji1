import { View, Text, Image } from '@tarojs/components'

interface FoodData {
  food: string
  count: number
  unit: string
  nutrients: {
    calories: number
    carbohydrates: number
    protein: number
    fat: number
  }
}

interface Props {
  imageUrl: string
  data: FoodData
}

export default function FoodCard({ imageUrl, data }: Props) {
  return (
    <View className='food-card'>
      <Image className='food-image' src={imageUrl} mode='aspectFill' />
      <View className='food-info'>
        <Text className='food-name'>{data.food}</Text>
        <Text className='food-amount'>{data.count}{data.unit}</Text>
        <View className='nutrients'>
          <View className='nutrient-item'>
            <Text className='value'>{data.nutrients.calories}</Text>
            <Text className='label'>热量(千卡)</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='value'>{data.nutrients.carbohydrates}</Text>
            <Text className='label'>碳水(克)</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='value'>{data.nutrients.protein}</Text>
            <Text className='label'>蛋白质(克)</Text>
          </View>
          <View className='nutrient-item'>
            <Text className='value'>{data.nutrients.fat}</Text>
            <Text className='label'>脂肪(克)</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
