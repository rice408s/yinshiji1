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
      <View className='stats-grid'>
        <View className='stat-item calories'>
          <Text className='value'>{calories.toFixed(0)}</Text>
          <Text className='label'>已摄入</Text>
          <Text className='goal'>目标 {caloriesGoal}kcal</Text>
        </View>
        <View className='nutrients'>
          <View className='bar-item'>
            <View className='label'>蛋白质</View>
            <View className='bar-wrapper'>
              <View className='bar protein' style={{ height: `${(protein / 100) * 100}%` }} />
            </View>
            <View className='value'>{protein.toFixed(1)}g</View>
          </View>
          <View className='bar-item'>
            <View className='label'>脂肪</View>
            <View className='bar-wrapper'>
              <View className='bar fat' style={{ height: `${(fat / 100) * 100}%` }} />
            </View>
            <View className='value'>{fat.toFixed(1)}g</View>
          </View>
          <View className='bar-item'>
            <View className='label'>碳水</View>
            <View className='bar-wrapper'>
              <View className='bar carbs' style={{ height: `${(carbs / 200) * 100}%` }} />
            </View>
            <View className='value'>{carbs.toFixed(1)}g</View>
          </View>
        </View>
      </View>
    </View>
  )
}
