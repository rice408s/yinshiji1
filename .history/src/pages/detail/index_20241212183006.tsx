import { View } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { cloud } from '@tarojs/taro'
import FoodCard from '../../components/PublishModal/FoodCard'
import './index.scss'

export default function Detail() {
  const router = useRouter()
  const { id } = router.params
  const [record, setRecord] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('记录ID不存在')
      setLoading(false)
      return
    }

    console.log('Fetching detail for id:', id)

    // 获取记录详情
    cloud.callFunction({
      name: 'food',
      data: {
        action: 'getDetail',
        id
      }
    }).then((res: any) => {
      console.log('API response:', res)

      if (res.result.code === 200 && res.result.data?.record) {
        setRecord(res.result.data.record)
      } else {
        setError(res.result.message || '获取记录失败')
      }
    }).catch(err => {
      console.error('Failed to fetch detail:', err)
      setError('获取记录失败')
    }).finally(() => {
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return <View className='loading'>加载中...</View>
  }

  if (error) {
    return <View className='error'>{error}</View>
  }

  if (!record) {
    return <View className='error'>记录不存在</View>
  }

  return (
    <View className='detail-page'>
      <FoodCard
        imageUrl={record.imageUrl}
        data={{
          food: record.food,
          count: record.count,
          unit: record.unit,
          nutrients: record.nutrients
        }}
      />
      {record.description && (
        <View className='description'>
          {record.description}
        </View>
      )}
    </View>
  )
}

