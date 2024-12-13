import { View, Text } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { FoodRecord } from '../../types/food'
import { formatLocalTime } from '../../utils/date'
import FoodGridCard from '../FoodGridCard'
import './index.scss'

interface Props {
  records: FoodRecord[]
}

interface GroupedRecords {
  date: string
  records: FoodRecord[]
}

export default function FoodRecordsList({ records }: Props) {
  // 按日期分组记录
  const groupRecordsByDate = (records: FoodRecord[]): GroupedRecords[] => {
    const groups: { [key: string]: FoodRecord[] } = {}

    records.forEach(record => {
      const date = formatLocalTime(record.createdAt)
      const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(record)
    })

    return Object.entries(groups)
      .map(([date, records]) => ({
        date,
        records: records.sort((a, b) =>
          formatLocalTime(b.createdAt).getTime() - formatLocalTime(a.createdAt).getTime()
        )
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const handleCardClick = (id: string) => {
    navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  const groupedRecords = groupRecordsByDate(records)

  return (
    <View className='records-list'>
      {groupedRecords.map(group => (
        <View key={group.date} className='date-group'>
          {group.records.map((record, index) => (
            <FoodGridCard
              key={record._id}
              id={record._id}
              imageUrl={record.imageUrl}
              food={record.food}
              count={record.count}
              unit={record.unit}
              nutrients={record.nutrients}
              description={record.description}
              createdAt={record.createdAt}
              showDate={index === 0}
            />
          ))}
        </View>
      ))}
    </View>
  )
}
