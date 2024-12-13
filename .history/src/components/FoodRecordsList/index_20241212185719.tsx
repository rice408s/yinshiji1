import { View, Text, Image } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { formatDate } from '../../utils/format'
import { FoodRecord } from '../../types/food'
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
              <Text className='food-name'>{record.food}</Text>
              <Text className='time'>{formatDate(record.createdAt)}</Text>
            </View>
            <View className='info'>
              {record.count && record.unit && (
                <Text className='amount'>{record.count}{record.unit}</Text>
              )}
              {record.nutrients?.calories && (
                <Text className='calories'>{record.nutrients.calories}kcal</Text>
              )}
            </View>
            {record.description && (
              <Text className='description'>{record.description}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  )
}
