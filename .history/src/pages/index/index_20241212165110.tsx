import { View, Button, Text } from '@tarojs/components'
import { useState, useRef } from 'react'
import FoodRecordsList from '../../components/FoodRecordsList'
import PublishModal from '../../components/PublishModal'
import './index.scss'

export default function Index() {
  const [showPublish, setShowPublish] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const [page, setPage] = useState(1)
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const lastScrollTopRef = useRef(0)
  const modalOpenScrollTopRef = useRef(0)

  // 处理滚动
  const handleScroll = (e) => {
    lastScrollTopRef.current = e.detail.scrollTop
  }

  // 加载更多
  const onScrollToUpper = async () => {
    const nextPage = page + 1
    await fetchRecords(nextPage)
    setPage(nextPage)
  }

  // 获取记录
  const fetchRecords = async (pageNum: number, reset = false) => {
    // ... 获取数据的逻辑
  }

  // 处理打开发布弹窗
  const handleOpenPublish = () => {
    modalOpenScrollTopRef.current = lastScrollTopRef.current
    setShowPublish(true)
  }

  // 处理弹窗关闭
  const handleModalClose = async (isComplete: boolean) => {
    setShowPublish(false)

    if (isComplete) {
      setPage(1)
      await fetchRecords(1, true)
    } else {
      setScrollTop(modalOpenScrollTopRef.current)
    }
  }

  if (isLoading) return null

  return (
    <View className='index'>
      <FoodRecordsList
        records={records}
        onLoadMore={onScrollToUpper}
        scrollTop={scrollTop}
        isInitialLoad={isInitialLoad}
        onScroll={handleScroll}
      />

      <Button className='float-publish-btn' onClick={handleOpenPublish}>
        <Text className='plus'></Text>
      </Button>

      <PublishModal visible={showPublish} onClose={handleModalClose} />
    </View>
  )
}
