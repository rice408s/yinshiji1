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
  const progress = Math.min((calories / caloriesGoal) * 100, 100)
  const remaining = Math.max(caloriesGoal - calories, 0)

  const getSuggestion = () => {
    const percent = (calories / caloriesGoal) * 100
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
    <View className='stats-card'>
      <View className='calories-section'>
        <View className='header'>
          <Text className='title'>卡路里目标</Text>
          <Text className='goal'>{caloriesGoal}kcal</Text>
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

      <View className='nutrients-section'>
        <View className='header'>
          <Text className='title'>营养素摄入</Text>
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
    </View>
  )
}
