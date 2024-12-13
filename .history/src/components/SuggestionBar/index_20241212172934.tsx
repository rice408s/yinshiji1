import { View, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  message: string
  icon?: string
}

export default function SuggestionBar({ message, icon = '💡' }: Props) {
  return (
    <View className='suggestion-bubble'>
      <Text className='icon'>{icon}</Text>
      <Text className='message'>{message}</Text>
    </View>
  )
}
