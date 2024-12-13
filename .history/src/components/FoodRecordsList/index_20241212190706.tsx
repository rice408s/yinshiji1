import { View, Text, Image } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { FoodRecord } from '../../types/food'
import { formatDate } from '../../utils/format'
import './index.scss'

interface Props {
  records: FoodRecord[]
}

export default function FoodRecordsList({ records }: Props) {
  const handleRecordClick = (id: string) => {
    navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  return (
    <View className='records-list'>
      <View className='records-grid'>
        {records.map(record => (
          <View
            key={record._id}
            className='record-card'
            onClick={() => handleRecordClick(record._id)}
          >
            <Image
              className='food-image'
              src={record.imageUrl}
              mode='aspectFill'
            />
            <View className='content'>
              <View className='header'>
                <Text className='title'>{record.food}</Text>
                <Text className='time'>{formatDate(record.createdAt)}</Text>
              </View>
              {record.description && (
                <Text className='description'>{record.description}</Text>
              )}
              {record.nutrients && (
                <View className='nutrients'>
                  <View className='nutrient'>
                    <Text className='label'>热量</Text>
                    <Text className='value'>{record.nutrients.calories}kcal</Text>
                  </View>
                  <View className='nutrient'>
                    <Text className='label'>蛋白质</Text>
                    <Text className='value'>{record.nutrients.protein}g</Text>
                  </View>
                  <View className='nutrient'>
                    <Text className='label'>碳水</Text>
                    <Text className='value'>{record.nutrients.carbohydrates}g</Text>
                  </View>
                  <View className='nutrient'>
                    <Text className='label'>脂肪</Text>
                    <Text className='value'>{record.nutrients.fat}g</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
