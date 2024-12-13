import { View, Button, Text } from '@tarojs/components'
import { useState, useRef } from 'react'
import FoodRecordsList from '@/components/FoodRecordsList'
import DietSuggestion from '@/components/DietSuggestion'
import PublishModal from '@/components/PublishModal'
import { useFoodRecords } from '@/hooks/useFoodRecords'
import './index.scss'

export default function Index() {
  const [showPublish, setShowPublish] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const lastScrollTopRef = useRef(0)
  const modalOpenScrollTopRef = useRef(0)

  const {
    records,
    isLoading,
    isInitialLoad,
    dailyNutrients,
    fetchRecords,
    setPage
  } = useFoodRecords()

  const handleScroll = (e) => {
    lastScrollTopRef.current = e.detail.scrollTop
  }

  const onScrollToUpper = async () => {
    setPage(prev => prev + 1)
    await fetchRecords(page + 1)
  }

  const handleOpenPublish = () => {
    modalOpenScrollTopRef.current = lastScrollTopRef.current
    setShowPublish(true)
  }

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
      <DietSuggestion
        dailyCalories={dailyNutrients.calories}
        dailyProtein={dailyNutrients.protein}
        dailyFat={dailyNutrients.fat}
        dailyCarbs={dailyNutrients.carbs}
      />

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
