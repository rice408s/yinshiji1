import { View, Text, Image } from '@tarojs/components'
import { useRouter, navigateBack } from '@tarojs/taro'
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

  const handleBack = () => {
    navigateBack()
  }

  const formatDate = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <View className='detail-page'>
        <View className='nav-bar'>
          <View className='back-btn' onClick={handleBack}>
            <Text className='icon'>←</Text>
          </View>
          <Text className='title'>记录详情</Text>
        </View>
        <View className='loading'>
          <View className='loading-spinner' />
          <Text>加载中...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View className='detail-page'>
        <View className='nav-bar'>
          <View className='back-btn' onClick={handleBack}>
            <Text className='icon'>←</Text>
          </View>
          <Text className='title'>记录详情</Text>
        </View>
        <View className='error'>
          <Text className='icon'>!</Text>
          <Text>{error}</Text>
          <View className='retry-btn' onClick={() => setLoading(true)}>
            重试
          </View>
        </View>
      </View>
    )
  }

  if (!record) {
    return (
      <View className='detail-page'>
        <View className='nav-bar'>
          <View className='back-btn' onClick={handleBack}>
            <Text className='icon'>←</Text>
          </View>
          <Text className='title'>记录详情</Text>
        </View>
        <View className='error'>记录不存在</View>
      </View>
    )
  }

  return (
    <View className='detail-page'>
      <View className='nav-bar'>
        <View className='back-btn' onClick={handleBack}>
          <Text className='icon'>←</Text>
        </View>
        <Text className='title'>记录详情</Text>
      </View>

      <View className='content'>
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
          <View className='description-card'>
            <Text className='label'>备注</Text>
            <Text className='text'>{record.description}</Text>
          </View>
        )}

        <View className='info-card'>
          <View className='info-item'>
            <Text className='label'>记录时间</Text>
            <Text className='value'>{formatDate(record.createdAt)}</Text>
          </View>
          <View className='info-item'>
            <Text className='label'>更新时间</Text>
            <Text className='value'>{formatDate(record.updatedAt)}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

