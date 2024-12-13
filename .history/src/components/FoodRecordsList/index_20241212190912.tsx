import { View } from '@tarojs/components'
import { formatTime } from '../../utils/format'
import FoodCard from '../PublishModal/FoodCard'
import './index.scss'

export default function FoodRecordsList({ records = [] }) {
  return (
    <View className='records-list'>
      <View className='records-grid'>
        {records.map(record => (
          <View
            key={record._id}
            className='record-item'
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/detail/index?id=${record._id}`
              })
            }}
          >
            <FoodCard
              imageUrl={record.imageUrl}
              data={{
                food: record.food,
                count: record.count,
                unit: record.unit,
                nutrients: record.nutrients,
                time: formatTime(record.createdAt)
              }}
            />
          </View>
        ))}
      </View>
    </View>
  )
}
