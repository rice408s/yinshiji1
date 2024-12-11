import { View, Image, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  imageUrl: string
  food: string
  count?: number
  unit?: string
}

export default function FoodGridCard({ imageUrl, food, count, unit }: Props) {
  return (
    <View className='food-grid-card'>
      <Image className='food-image' src={imageUrl} mode='aspectFill' />
      <View className='food-info'>
        <Text className='food-name'>{food}</Text>
        {count && <Text className='food-count'>{count}{unit || '份'}</Text>}
      </View>
    </View>
  )
}
