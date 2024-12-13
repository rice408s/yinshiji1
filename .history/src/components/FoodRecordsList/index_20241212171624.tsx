import { View, ScrollView } from '@tarojs/components'
import FoodGridCard from '../FoodGridCard'
import './index.scss'

interface Props {
  records: any[]
  onLoadMore: () => void
  scrollTop: number
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
      scrollTop={scrollTop}
      onScrollToUpper={onLoadMore}
      onScroll={onScroll}
    >
      <View className='records-container'>
        <View className='records-grid'>
          {records.map(record => (
            <FoodGridCard
              key={record.id}
              {...record}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  )
}
