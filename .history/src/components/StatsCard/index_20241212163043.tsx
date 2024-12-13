import { View, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  protein: number
  fat: number
  carbs: number
  calories: number
  caloriesGoal?: number
}

export default function StatsCard({
  protein,
  fat,
  carbs,
  calories,
  caloriesGoal = 2000
}: Props) {
  return (
    <View className='stats-card'>
      <View className='header'>
        <Text className='title'>今日摄入</Text>
        <View className='calories-info'>
          <Text className='value'>{calories}</Text>
          <Text className='unit'>/ {caloriesGoal}kcal</Text>
        </View>
      </View>

      <View className='nutrients-grid'>
        <View className='nutrient-item'>
          <View className='progress-bar'>
            <View
              className='progress protein'
              style={{ width: `${Math.min((protein / 100) * 100, 100)}%` }}
            />
          </View>
          <View className='info'>
            <Text className='label'>蛋白质</Text>
            <Text className='value'>{protein.toFixed(1)}g</Text>
          </View>
        </View>

        <View className='nutrient-item'>
          <View className='progress-bar'>
            <View
              className='progress fat'
              style={{ width: `${Math.min((fat / 100) * 100, 100)}%` }}
            />
          </View>
          <View className='info'>
            <Text className='label'>脂肪</Text>
            <Text className='value'>{fat.toFixed(1)}g</Text>
          </View>
        </View>

        <View className='nutrient-item'>
          <View className='progress-bar'>
            <View
              className='progress carbs'
              style={{ width: `${Math.min((carbs / 200) * 100, 100)}%` }}
            />
          </View>
          <View className='info'>
            <Text className='label'>碳水</Text>
            <Text className='value'>{carbs.toFixed(1)}g</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
