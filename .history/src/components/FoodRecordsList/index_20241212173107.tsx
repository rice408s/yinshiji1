import { View } from '@tarojs/components'
import FoodGridCard from '../FoodGridCard'
import { FoodRecord } from '../../types/food'
import './index.scss'

interface Props {
  records: FoodRecord[]
}

export default function FoodRecordsList({ records }: Props) {
  return (
    <View className='records-list'>
      <View className='records-grid'>
        {records.map(record => (
          <FoodGridCard
            key={record._id}
            imageUrl={record.imageUrl}
            food={record.food}
            count={record.count}
            unit={record.unit}
            nutrients={record.nutrients}
            description={record.description}
            createdAt={new Date(record.createdAt)}
          />
        ))}
      </View>
    </View>
  )
}
