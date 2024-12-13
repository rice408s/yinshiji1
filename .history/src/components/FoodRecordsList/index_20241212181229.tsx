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
      {records.map((record, index) => (
        <FoodGridCard
          key={record._id}
          id={record._id}
          imageUrl={record.imageUrl}
          food={record.food}
          count={record.count}
          unit={record.unit}
          nutrients={record.nutrients}
          description={record.description}
          createdAt={new Date(record.createdAt)}
          showDate={index === 0 || new Date(record.createdAt).toDateString() !== new Date(records[index - 1]?.createdAt).toDateString()}
        />
      ))}
    </View>
  )
}
