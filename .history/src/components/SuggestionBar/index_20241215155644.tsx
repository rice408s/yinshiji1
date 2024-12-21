import { View, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  message: string
  icon: string
  onRefresh?: () => void
}

export default function SuggestionBar({ message, icon, onRefresh }: Props) {
  return (
    <View className='suggestion-bubble'>
      <Text className='icon'>{icon}</Text>
      <Text className='message'>{message}</Text>
      {onRefresh && (
        <Text className='refresh-icon' onClick={onRefresh}>
          🔄
        </Text>
      )}
    </View>
  )
}
