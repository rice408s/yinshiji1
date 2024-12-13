import { useState, useEffect } from 'react'

interface FoodRecord {
  id: string
  name: string
  image: string
  calories: number
  amount: string
  date: string
  time: string
}

export function useFoodRecords() {
  const [records, setRecords] = useState<FoodRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [page, setPage] = useState(1)

  const fetchRecords = async (pageNum: number, reset = false) => {
    try {
      setIsLoading(true)
      // 这里模拟API调用
      const mockData: FoodRecord[] = [
        {
          id: '1',
          name: '苹果',
          image: 'https://example.com/apple.jpg',
          calories: 100,
          amount: '2个',
          date: '12月12日',
          time: '16:04'
        },
        {
          id: '2',
          name: '橘子',
          image: 'https://example.com/orange.jpg',
          calories: 141,
          amount: '3个',
          date: '12月12日',
          time: '15:39'
        }
      ]

      await new Promise(resolve => setTimeout(resolve, 500)) // 模拟加载延迟

      if (reset) {
        setRecords(mockData)
      } else {
        setRecords(prev => [...prev, ...mockData])
      }

      setIsInitialLoad(false)
    } catch (error) {
      console.error('Failed to fetch records:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords(1, true)
  }, [])

  return {
    records,
    isLoading,
    isInitialLoad,
    page,
    setPage,
    fetchRecords
  }
}
