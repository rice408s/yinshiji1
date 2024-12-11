import { View, Image, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  imageUrl: string
  food: string
  count?: number
  unit?: string
  calories?: number
}

export default function FoodGridCard({ imageUrl, food, count, unit, calories }: Props) {
  return (
    <View className='food-grid-card'>
      <Image className='food-image' src={imageUrl} mode='aspectFill' />
      {calories && (
        <View className='calories-badge'>
          <Text className='value'>{calories}</Text>
          <Text className='unit'>kcal</Text>
        </View>
      )}
      <View className='food-info'>
        <Text className='food-name'>{food}</Text>
        <View className='food-meta'>
          {count && <Text className='food-count'>{count}{unit || '份'}</Text>}
        </View>
      </View>
    </View>
  )
}
