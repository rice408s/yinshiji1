import { View, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  calories: number
  goal?: number
}

export default function CaloriesGoal({ calories, goal = 2000 }: Props) {
  const progress = Math.min((calories / goal) * 100, 100)

  return (
    <View className='calories-goal'>
      <View className='header'>
        <Text className='title'>卡路里目标</Text>
        <Text className='goal'>{goal}kcal</Text>
      </View>
      <View className='progress-bar'>
        <View
          className='progress'
          style={{ width: `${progress}%` }}
        />
      </View>
      <View className='info'>
        <Text className='current'>已摄入 {calories.toFixed(0)}kcal</Text>
        <Text className='remaining'>
          还差 {Math.max(goal - calories, 0).toFixed(0)}kcal
        </Text>
      </View>
    </View>
  )
}
