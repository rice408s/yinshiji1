import { View, Text } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { FoodRecord } from '../../types/food'
import { formatTime } from '../../utils/format'
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
      const date = new Date(record.createdAt)
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
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const groupedRecords = groupRecordsByDate(records)

  return (
    <View className='records-list'>
      <View className='records-grid'>
        {records.map(record => (
          <View
            key={record._id}
            className='record-card'
            onClick={() => handleCardClick(record._id)}
          >
            <Text className='time'>{formatTime(record.createdAt)}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
