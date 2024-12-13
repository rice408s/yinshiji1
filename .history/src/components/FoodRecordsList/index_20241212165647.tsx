import { View } from '@tarojs/components'
import { FoodRecord } from '../../types/food'
import FoodGridCard from '../FoodGridCard'
import './index.scss'

interface Props {
  records: FoodRecord[]
  isInitialLoad: boolean
}

export default function FoodRecordsList({
  records,
  isInitialLoad
}: Props) {
  if (isInitialLoad) return null

  return (
    <View className='records-list'>
      <View className='records-container'>
        <View className='records-grid'>
          {records.map(record => (
            <FoodGridCard key={record._id} record={record} />
          ))}
        </View>
      </View>
    </View>
  )
}
