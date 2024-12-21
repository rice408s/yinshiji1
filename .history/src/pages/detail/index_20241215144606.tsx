import { View, Text } from '@tarojs/components'
import Taro, {
  useRouter,
  showModal,
  showToast,
  navigateBack,
  useDidShow,
  cloud
} from '@tarojs/taro'
import { useEffect, useState } from 'react'
import DetailFoodCard from '../../components/DetailFoodCard'
import './index.scss'

// 新增时间格式化函数
const formatRecordTime = (date: string | Date) => {
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')

  return {
    date: `${month}-${day}`,
    time: `${hour}:${minute}`
  }
}

interface FoodRecord {
  id: string
  food: string
  count: number
  unit: string
  imageUrl: string
  nutrients: any
  description?: string
  createdAt: Date
  updatedAt: Date
}

export default function Detail() {
  const router = useRouter()
  const { id } = router.params
  const [record, setRecord] = useState<FoodRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取记录详情
  const fetchDetail = async () => {
    try {
      setLoading(true)
      const res: any = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'getDetail',
          id
        }
      })

      if (res.result.code === 200 && res.result.data?.record) {
        const recordData = {
          ...res.result.data.record,
          createdAt: new Date(res.result.data.record.createdAt),
          updatedAt: new Date(res.result.data.record.updatedAt)
        }
        setRecord(recordData)
      } else {
        setError(res.result.message || '获取记录失败')
      }
    } catch (err) {
      console.error('Failed to fetch detail:', err)
      setError('获取记录失败')
    } finally {
      setLoading(false)
    }
  }

  // 页面首次加载
  useEffect(() => {
    if (!id) {
      setError('记录ID不存在')
      setLoading(false)
      return
    }
    fetchDetail()
  }, [id])

  // 页面显示时刷新数据
  useDidShow(() => {
    if (id) {
      fetchDetail()
    }
  })

  // 处理删除
  const handleDelete = async () => {
    const { confirm } = await showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      confirmColor: '#ff4d4f'
    })

    if (!confirm) return

    try {
      const res: any = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'deleteRecord',
          id
        }
      })

      if (res.result.code === 200) {
        showToast({
          title: '删除成功',
          icon: 'success'
        })
        setTimeout(() => {
          navigateBack()
        }, 1500)
      } else {
        throw new Error(res.result.message)
      }
    } catch (err) {
      showToast({
        title: '删除失败',
        icon: 'error'
      })
    }
  }

  // 处理编辑
  const handleEdit = () => {
    Taro.navigateTo({
      url: `/pages/record/edit/index?id=${id}`
    })
  }

  if (loading) {
    return (
      <View className='detail-page'>
        <View className='loading'>
          <View className='loading-spinner' />
          <Text>jia载中...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View className='detail-page'>
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
        <View className='error'>记录不存在</View>
      </View>
    )
  }

  return (
    <View className='detail-page'>
      <View className='content'>
        {record && (
          <DetailFoodCard
            imageUrl={record.imageUrl}
            food={record.food}
            count={record.count}
            unit={record.unit}
            nutrients={record.nutrients}
          />
        )}

        {record.description && (
          <View className='description-card'>
            <Text className='label'>备注</Text>
            <Text className='text'>{record.description}</Text>
          </View>
        )}

        <View className='info-card'>
          <View className='info-item'>
            <Text className='label'>记录时间</Text>
            <Text className='value'>
              {record.createdAt && (() => {
                const { date, time } = formatRecordTime(record.createdAt)
                return `${date} ${time}`
              })()}
            </Text>
          </View>
        </View>

        <View className='action-buttons'>
          <View className='btn edit' onClick={handleEdit}>
            <Text className='icon'>✎</Text>
            <Text>编辑</Text>
          </View>
          <View className='btn delete' onClick={handleDelete}>
            <Text className='icon'>🗑</Text>
            <Text>删除</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

