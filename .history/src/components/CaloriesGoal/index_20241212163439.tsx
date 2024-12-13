import { View, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  calories: number
  goal?: number
}

export default function CaloriesGoal({ calories, goal = 2000 }: Props) {
  const progress = Math.min((calories / goal) * 100, 100)
  const remaining = Math.max(goal - calories, 0)

  // 根据摄入情况给出建议
  const getSuggestion = () => {
    const percent = (calories / goal) * 100

    if (percent < 50) {
      return '建议适当增加食物摄入'
    } else if (percent < 80) {
      return '摄入情况良好，继续保持'
    } else if (percent < 100) {
      return '即将达到目标，注意适量'
    } else {
      return '已超出目标，建议控制摄入'
    }
  }

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
          还差 {remaining.toFixed(0)}kcal
        </Text>
      </View>
      <View className='suggestion'>
        <Text className='icon'>💡</Text>
        <Text className='text'>{getSuggestion()}</Text>
      </View>
    </View>
  )
}
