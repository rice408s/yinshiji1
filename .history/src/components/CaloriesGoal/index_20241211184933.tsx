import { View, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  calories: number
  goal?: number
}

export default function CaloriesGoal({ calories, goal = 2500 }: Props) {
  return (
    <View className='daily-goals'>
      <View className='goal-item'>
        <View className='goal-header'>
          <Text className='label'>卡路里目标</Text>
          <Text className='value'>{calories.toFixed(0)}/{goal}</Text>
        </View>
        <View className='progress-bar'>
          <View
            className='progress calories'
            style={{ width: `${Math.min((calories / goal) * 100, 100)}%` }}
          />
        </View>
      </View>
    </View>
  )
}
