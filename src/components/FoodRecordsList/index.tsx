import { View, ScrollView } from '@tarojs/components'
import FoodGridCard from '../FoodGridCard'
import { FoodRecord } from '../../types/food'
import './index.scss'

interface Props {
  records: FoodRecord[]
  onLoadMore: () => void
  scrollTop?: number
  isInitialLoad: boolean
  onScroll: (e: any) => void
}

export default function FoodRecordsList({
  records,
  onLoadMore,
  scrollTop,
  isInitialLoad,
  onScroll
}: Props) {
  return (
    <ScrollView
      className='records-list'
      scrollY
      scrollTop={isInitialLoad ? undefined : scrollTop}
      onScrollToUpper={onLoadMore}
      upperThreshold={100}
      enhanced
      bounces={false}
      showScrollbar={false}
      onScroll={onScroll}
    >
      <View className='records-container'>
        <View className='records-grid'>
          {records.map(record => (
            <View key={record._id} className='record-item'>
              <FoodGridCard
                imageUrl={record.imageUrl}
                food={record.food}
                count={record.count}
                unit={record.unit}
                nutrients={record.nutrients}
                description={record.description}
                createdAt={new Date(record.createdAt)}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}
