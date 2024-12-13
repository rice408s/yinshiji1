import { View, Text } from '@tarojs/components'
import './index.scss'

interface NutritionData {
  calories: number
  carbohydrates: number
  protein: number
  fat: number
}

interface Props {
  data: {
    food: string
    count?: number
    unit?: string
    time?: string
    nutrients?: NutritionData
  }
}

const NutritionCard = ({ data }: Props) => {
  const { food, count = 1, unit = '份', nutrients } = data

  if (!nutrients) return null

  return (
    <View className='nutrition-card'>
      <View className='card-header'>
        <Text className='title'>营养成分</Text>
        <Text className='subtitle'>{`${food} ${count}${unit}`}</Text>
      </View>

      <View className='nutrients-grid'>
        <View className='nutrient-item'>
          <Text className='value'>{nutrients.calories}</Text>
          <Text className='label'>热量(kcal)</Text>
        </View>
        <View className='nutrient-item'>
          <Text className='value'>{nutrients.carbohydrates}</Text>
          <Text className='label'>碳水(g)</Text>
        </View>
        <View className='nutrient-item'>
          <Text className='value'>{nutrients.protein}</Text>
          <Text className='label'>蛋白质(g)</Text>
        </View>
        <View className='nutrient-item'>
          <Text className='value'>{nutrients.fat}</Text>
          <Text className='label'>脂肪(g)</Text>
        </View>
      </View>
    </View>
  )
}

export default NutritionCard
