import { View, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  dailyCalories: number
  dailyProtein: number
  dailyFat: number
  dailyCarbs: number
}

export default function DietSuggestion({
  dailyCalories,
  dailyProtein,
  dailyFat,
  dailyCarbs
}: Props) {
  // 根据摄入情况给出建议
  const getSuggestion = () => {
    if (dailyProtein < 40) {
      return {
        title: '蛋白质摄入不足',
        desc: '建议多吃瘦肉、鱼、蛋、豆制品等高蛋白食物',
        icon: '🥩'
      }
    } else if (dailyFat > 65) {
      return {
        title: '脂肪摄入偏高',
        desc: '建议减少油炸食品，选择清蒸、水煮的烹饪方式',
        icon: '🥗'
      }
    } else if (dailyCarbs < 120) {
      return {
        title: '碳水摄入不足',
        desc: '建议适量增加全谷物、薯类等优质碳水',
        icon: '🍚'
      }
    } else {
      return {
        title: '营养均衡',
        desc: '今日饮食搭配合理，继续保持',
        icon: '👍'
      }
    }
  }

  const suggestion = getSuggestion()

  return (
    <View className='diet-suggestion'>
      <View className='suggestion-card'>
        <View className='icon'>{suggestion.icon}</View>
        <View className='content'>
          <Text className='title'>{suggestion.title}</Text>
          <Text className='desc'>{suggestion.desc}</Text>
        </View>
      </View>
    </View>
  )
}
