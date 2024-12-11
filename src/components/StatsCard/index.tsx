import { View, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  protein: number
  fat: number
  carbs: number
}

export default function StatsCard({ protein, fat, carbs }: Props) {
  const today = new Date()
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`

  return (
    <View className='stats-card'>
      <View className='stats-header'>
        <Text className='title'>今日摄入</Text>
        <Text className='date'>{dateStr}</Text>
      </View>
      <View className='stats-grid'>
        <View className='stat-item'>
          <Text className='value protein'>{protein.toFixed(1)}g</Text>
          <Text className='label'>蛋白质</Text>
        </View>
        <View className='stat-item'>
          <Text className='value fat'>{fat.toFixed(1)}g</Text>
          <Text className='label'>脂肪</Text>
        </View>
        <View className='stat-item'>
          <Text className='value carbs'>{carbs.toFixed(1)}g</Text>
          <Text className='label'>碳水</Text>
        </View>
      </View>
    </View>
  )
}
