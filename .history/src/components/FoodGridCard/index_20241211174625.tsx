import { View, Image, Text } from '@tarojs/components'
import './index.scss'

interface Props {
  imageUrl?: string
  food: string
  count?: number
  unit?: string
  calories?: number
  nutrients?: string[]
  time?: string
}

export default function FoodGridCard({
  imageUrl,
  food,
  count,
  unit,
  calories,
  nutrients,
  time
}: Props) {
  return (
    <View className='food-card'>
      <View className='food-content'>
        {imageUrl ? (
          <Image className='food-image' src={imageUrl} mode='aspectFill' />
        ) : (
          <View className='food-icon'>🍜</View>
        )}
        <View className='food-info'>
          <View className='food-title'>
            <Text className='name'>{food}</Text>
            <Text className='amount'>{count} {unit}</Text>
          </View>
          <View className='food-detail'>
            <Text className='calories'>{calories}kcal</Text>
            {nutrients && <Text className='nutrients'>| {nutrients.join('、')}</Text>}
          </View>
        </View>
      </View>
      <Text className='time'>{time}</Text>
    </View>
  )
}
