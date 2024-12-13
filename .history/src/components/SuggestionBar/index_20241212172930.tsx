import { View, Text } from '@tarojs/components'
import './index.scss'

interface Suggestion {
  icon: string
  text: string
  onClick?: () => void
}

interface Props {
  suggestions: Suggestion[]
}

export default function SuggestionBar({ suggestions }: Props) {
  return (
    <View className='suggestion-bar'>
      {suggestions.map((item, index) => (
        <View key={index} className='suggestion-item' onClick={item.onClick}>
          <Text className='icon'>{item.icon}</Text>
          <Text className='text'>{item.text}</Text>
        </View>
      ))}
    </View>
  )
}
