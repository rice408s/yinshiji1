import { View, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  protein: number
  fat: number
  carbs: number
}

export default function StatsCard({ protein, fat, carbs }: Props) {
  return (
    <View className='stats-card'>
      <View className='title'>今日摄入</View>
      <View className='stats-grid'>
        <View className='stat-item protein'>
          <Text className='value'>{protein.toFixed(1)}</Text>
          <Text className='label'>蛋白质</Text>
        </View>
        <View className='stat-item fat'>
          <Text className='value'>{fat.toFixed(1)}</Text>
          <Text className='label'>脂肪</Text>
        </View>
        <View className='stat-item carbs'>
          <Text className='value'>{carbs.toFixed(1)}</Text>
          <Text className='label'>碳水</Text>
        </View>
      </View>
    </View>
  )
}
