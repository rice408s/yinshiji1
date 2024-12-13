import { View, Text, Button } from '@tarojs/components'
import Taro, { cloud, useReachBottom } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { checkIsLoggedIn, setUserInfo, clearUserInfo } from '../../utils/auth'
import FoodRecordsList from '../../components/FoodRecordsList'
import PublishModal from '../../components/PublishModal'
import { FoodRecord } from '../../types/food'
import DietSuggestion from '../../components/DietSuggestion'
import './index.scss'

const PAGE_SIZE = 10

export default function Index() {
  const [showPublish, setShowPublish] = useState(false)
  const [page, setPage] = useState(1)
  const [records, setRecords] = useState<FoodRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      setIsInitialLoad(false)
    }
  }, [records])

  // 获取食物记录
  const fetchRecords = async (pageNum = 1, refresh = false) => {
    try {
      const { result } = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'getRecords',
          page: pageNum,
          pageSize: PAGE_SIZE
        }
      }) as any

      if (result.code === 200) {
        const newRecords = result.data.records
        setHasMore(newRecords.length === PAGE_SIZE)

        if (refresh) {
          setRecords(newRecords)
        } else {
          setRecords(prev => [...prev, ...newRecords])
        }
      }
    } catch (err) {
      console.error('获取记录失败:', err)
      Taro.showToast({
        title: '获取记录失败',
        icon: 'error'
      })
    }
  }

  // 检查登录状态
  const checkLoginStatus = async () => {
    try {
      if (!checkIsLoggedIn()) {
        Taro.redirectTo({ url: '/pages/login/index' })
        return
      }

      const { result } = await cloud.callFunction({
        name: 'user',
        data: { action: 'checkLogin' }
      }) as any

      if (result.code === 200) {
        setUserInfo({
          ...result.data.user,
          isLoggedIn: true
        })
        await fetchRecords()
      } else {
        clearUserInfo()
        Taro.redirectTo({ url: '/pages/login/index' })
      }
    } catch (err) {
      console.error('登录态验证失败:', err)
      clearUserInfo()
      Taro.redirectTo({ url: '/pages/login/index' })
    } finally {
      setIsLoading(false)
    }
  }

  // 使用 Taro 的 useReachBottom Hook
  useReachBottom(async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    const nextPage = page + 1
    await fetchRecords(nextPage)
    setPage(nextPage)
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
      <DietSuggestion
        dailyCalories={1241}
        dailyProtein={53.3}
        dailyFat={45.7}
        dailyCarbs={162.8}
      />
      <FoodRecordsList
        records={records}
        isInitialLoad={isInitialLoad}
      />

      <Button className='float-publish-btn' onClick={handleOpenPublish}>
        <Text className='plus'></Text>
      </Button>

      <PublishModal visible={showPublish} onClose={handleModalClose} />
    </View>
  )
}
