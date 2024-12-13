import { View, Button } from '@tarojs/components'
import Taro, { useLoad, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { cloud } from '../../utils/cloud'
import { FoodRecord } from '../../types/food'
import FoodRecordsList from '../../components/FoodRecordsList'
import PublishModal from '../../components/PublishModal'
import SuggestionBar from '../../components/SuggestionBar'
import './index.scss'

const PAGE_SIZE = 10

export default function Index() {
  const [records, setRecords] = useState<FoodRecord[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showPublish, setShowPublish] = useState(false)
  const [suggestion, setSuggestion] = useState({ message: '', icon: '' })

  // 获取记录列表
  const fetchRecords = async (pageNum = 1, replace = false) => {
    try {
      const { result } = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'getRecords',
          page: pageNum,
          pageSize: PAGE_SIZE
        }
      })

      if (result.code === 200) {
        const newRecords = result.data.records.map(record => ({
          ...record,
          createdAt: new Date(record.createdAt)
        }))

        // 如果是刷新或第一页，替换数据
        if (replace || pageNum === 1) {
          setRecords(newRecords)
        } else {
          // 否则追加数据
          setRecords(prev => [...prev, ...newRecords])
        }

        // 判断是否还有更多数据
        setHasMore(newRecords.length === PAGE_SIZE)
      }
    } catch (err) {
      console.error('获取记录失败:', err)
      Taro.showToast({
        title: '获取记录失败',
        icon: 'none'
      })
    }
  }

  // 初始加载
  useLoad(async () => {
    await fetchRecords()
    setIsLoading(false)
  })

  // 下拉刷新
  usePullDownRefresh(async () => {
    setPage(1)
    await fetchRecords(1, true)
    Taro.stopPullDownRefresh()
  })

  // 上拉加载更多
  useReachBottom(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)
    await fetchRecords(nextPage)
    setIsLoadingMore(false)
  })

  // 处理打开发布弹窗
  const handleOpenPublish = () => {
    setShowPublish(true)
  }

  // 处理弹窗关闭
  const handleModalClose = async (isComplete: boolean) => {
    setShowPublish(false)
    if (isComplete) {
      setPage(1)
      await fetchRecords(1, true)
    }
  }

  if (isLoading) return null

  return (
    <View className='index'>
      <SuggestionBar message={suggestion.message} icon={suggestion.icon} />
      <FoodRecordsList records={records} />

      <Button className='float-publish-btn' onClick={handleOpenPublish}>
        <Text className='plus'></Text>
      </Button>

      <PublishModal visible={showPublish} onClose={handleModalClose} />
    </View>
  )
}
