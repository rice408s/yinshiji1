import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { formatDate } from '../../utils/format'
import './index.scss'

interface Props {
  id: string
  imageUrl: string
  food: string
  count?: number
  unit?: string
  nutrients?: {
    calories: number
    carbohydrates: number
    protein: number
    fat: number
  }
  description?: string
  createdAt: string
  showDate?: boolean
}

export default function FoodGridCard({
  id,
  imageUrl,
  food,
  count,
  unit,
  nutrients,
  description,
  createdAt,
  showDate
}: Props) {

  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  return (
    <View className='food-grid-card' onClick={handleClick}>
      <Image
        className='food-image'
        src={imageUrl}
        mode='aspectFill'
      />
      <View className='food-info'>
        <View className='food-name'>{food}</View>
        {count && unit && (
          <View className='food-amount'>{count}{unit}</View>
        )}
        {nutrients && (
          <View className='nutrients'>
            <View className='nutrient'>
              <Text className='value'>{nutrients.calories}</Text>
              <Text className='unit'>kcal</Text>
            </View>
            <View className='nutrient'>
              <Text className='value'>{nutrients.protein}</Text>
              <Text className='unit'>蛋白质</Text>
            </View>
          </View>
        )}
        {description && (
          <View className='description'>{description}</View>
        )}
        <View className='time'>{createdAt}</View>
      </View>
    </View>
  )
}
