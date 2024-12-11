import { View, Image, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  imageUrl: string
  food: string
  count?: number
  unit?: string
}

const FoodGridCard: React.FC<Props> = ({ imageUrl, food, count, unit }) => {
  return (
    <View className='food-card'>
      <View className='image-wrapper'>
        <Image
          className='food-image'
          src={imageUrl}
          mode='aspectFill'
          lazyLoad
        />
      </View>
      <View className='content'>
        <Text className='food-name'>{food}</Text>
        {(count || unit) && (
          <Text className='quantity'>
            {count && count}{unit && unit}
          </Text>
        )}
      </View>
    </View>
  )
}

export default FoodGridCard
