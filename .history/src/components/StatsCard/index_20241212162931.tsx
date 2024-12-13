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
      <View className='title'>今日摄入</View>
      <View className='nutrients-list'>
        <View className='nutrient-item'>
          <View className='info'>
            <Text className='value'>{calories}</Text>
            <Text className='unit'>kcal</Text>
          </View>
          <View className='progress-bar'>
            <View
              className='progress calories'
              style={{ width: `${Math.min((calories / caloriesGoal) * 100, 100)}%` }}
            />
          </View>
          <Text className='label'>目标 {caloriesGoal}kcal</Text>
        </View>

        <View className='nutrient-item'>
          <View className='info'>
            <Text className='value'>{protein.toFixed(1)}</Text>
            <Text className='unit'>g</Text>
          </View>
          <View className='progress-bar'>
            <View
              className='progress protein'
              style={{ width: `${Math.min((protein / 100) * 100, 100)}%` }}
            />
          </View>
          <Text className='label'>蛋白质</Text>
        </View>

        <View className='nutrient-item'>
          <View className='info'>
            <Text className='value'>{fat.toFixed(1)}</Text>
            <Text className='unit'>g</Text>
          </View>
          <View className='progress-bar'>
            <View
              className='progress fat'
              style={{ width: `${Math.min((fat / 100) * 100, 100)}%` }}
            />
          </View>
          <Text className='label'>脂肪</Text>
        </View>

        <View className='nutrient-item'>
          <View className='info'>
            <Text className='value'>{carbs.toFixed(1)}</Text>
            <Text className='unit'>g</Text>
          </View>
          <View className='progress-bar'>
            <View
              className='progress carbs'
              style={{ width: `${Math.min((carbs / 200) * 100, 100)}%` }}
            />
          </View>
          <Text className='label'>碳水</Text>
        </View>
      </View>
    </View>
  )
}
