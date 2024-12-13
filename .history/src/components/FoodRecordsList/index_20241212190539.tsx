import { View, Text, Image } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { formatDateShort } from '../../utils/format'
import { FoodRecord } from '../../types/food'
import './index.scss'

interface Props {
  records: FoodRecord[]
}

export default function FoodRecordsList({ records }: Props) {
  const handleClick = (id: string) => {
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
          onClick={() => handleClick(record._id)}
        >
          <Image
            className='food-image'
            src={record.imageUrl}
            mode='aspectFill'
          />
          <View className='content'>
            <View className='header'>
              <Text className='title'>{record.food}</Text>
              <Text className='time'>{formatDateShort(record.createdAt)}</Text>
            </View>
            <View className='info'>
              {record.count && record.unit && (
                <Text className='amount'>
                  {record.count}{record.unit}
                </Text>
              )}
              {record.nutrients?.calories && (
                <Text className='calories'>
                  {record.nutrients.calories}千卡
                </Text>
              )}
            </View>
          </View>
        </View>
      ))}

      {records.length === 0 && (
        <View className='empty-state'>
          <Text className='icon'>📝</Text>
          <Text>还没有记录，快去添加吧~</Text>
        </View>
      )}
    </View>
  )
}
