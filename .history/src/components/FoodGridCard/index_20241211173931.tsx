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
      <View className='card-content'>
        <Image className='food-image' src={imageUrl} mode='aspectFill' />
        <View className='food-info'>
          <Text className='food-name'>{food}</Text>
          <View className='food-details'>
            {calories && (
              <View className='detail-item calories'>
                <Text className='value'>{calories}</Text>
                <Text className='label'>卡路里</Text>
              </View>
            )}
            {count && (
              <View className='detail-item amount'>
                <Text className='value'>{count}</Text>
                <Text className='label'>{unit || '份'}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}
