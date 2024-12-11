import { useState, useEffect, useRef } from 'react'
import { View, ScrollView } from '@tarojs/components'
import classNames from 'classnames'
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
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimer = useRef<NodeJS.Timeout>()

  const handleScroll = (e) => {
    onScroll(e)

    // 当滚动位置大于一定值时显示渐隐效果
    const scrollTop = e.detail.scrollTop
    setIsScrolling(scrollTop > 20) // 调整触发阈值

    // 滚动停止后一段时间隐藏渐隐效果
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current)
    }
    scrollTimer.current = setTimeout(() => {
      setIsScrolling(false)
    }, 150)
  }

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current)
      }
    }
  }, [])

  return (
    <View className='records-list'>
      <View className={classNames('fade-mask', {
        visible: isScrolling
      })} />
      <ScrollView
        className='records-scroll'
        scrollY
        scrollTop={isInitialLoad ? undefined : scrollTop}
        onScrollToUpper={onLoadMore}
        upperThreshold={100}
        enhanced
        bounces={false}
        showScrollbar={false}
        onScroll={handleScroll}
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
    </View>
  )
}
