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
      <View className='image-wrapper'>
        <Image className='food-image' src={imageUrl} mode='aspectFill' />
        {calories && (
          <View className='calories-tag'>
            <Text className='value'>{calories}</Text>
            <Text className='unit'>kcal</Text>
          </View>
        )}
      </View>
      <View className='food-info'>
        <Text className='food-name'>{food}</Text>
        {count && (
          <View className='amount-tag'>
            <Text>{count}</Text>
            <Text className='unit'>{unit || '份'}</Text>
          </View>
        )}
      </View>
    </View>
  )
}
