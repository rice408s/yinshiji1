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
  const caloriesPercent = Math.min((calories / caloriesGoal) * 100, 100)
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (caloriesPercent / 100) * circumference

  return (
    <View className='stats-card'>
      <View className='calories-ring'>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle
            className='ring-bg'
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            strokeWidth="8"
          />
          <circle
            className='ring-progress'
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <View className='ring-content'>
          <Text className='value'>{calories.toFixed(0)}</Text>
          <Text className='label'>已摄入</Text>
        </View>
      </View>

      <View className='nutrients-bars'>
        <View className='bar-item'>
          <View className='label'>蛋白质</View>
          <View className='bar-wrapper'>
            <View className='bar protein' style={{ height: `${(protein / 100) * 100}%` }} />
          </View>
          <View className='value'>{protein.toFixed(1)}</View>
        </View>
        <View className='bar-item'>
          <View className='label'>脂肪</View>
          <View className='bar-wrapper'>
            <View className='bar fat' style={{ height: `${(fat / 100) * 100}%` }} />
          </View>
          <View className='value'>{fat.toFixed(1)}</View>
        </View>
        <View className='bar-item'>
          <View className='label'>碳水</View>
          <View className='bar-wrapper'>
            <View className='bar carbs' style={{ height: `${(carbs / 200) * 100}%` }} />
          </View>
          <View className='value'>{carbs.toFixed(1)}</View>
        </View>
      </View>
    </View>
  )
}
