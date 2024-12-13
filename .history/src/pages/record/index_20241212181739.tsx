import { View, Image, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { cloud } from '../../utils/cloud'
import { FoodRecord } from '../../types/food'
import './index.scss'

definePageConfig({
  navigationBarTitleText: '记录详情'
})

export default function Record() {
  const router = useRouter()
  const [record, setRecord] = useState<FoodRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDetail()
  }, [])

  const fetchDetail = async () => {
    try {
      const { id } = router.params
      const res = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'getDetail',
          id
        }
      })

      if (res.result.code === 200) {
        setRecord({
          ...res.result.data.record,
          createdAt: new Date(res.result.data.record.createdAt)
        })
      }
    } catch (err) {
      console.error('获取详情失败:', err)
      Taro.showToast({
        title: '获取详情失败',
        icon: 'none'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !record) return null

  return (
    <View className='record'>
      <Image
        className='food-image'
        src={record.imageUrl}
        mode='aspectFill'
      />
      <View className='content'>
        <View className='header'>
          <Text className='food-name'>{record.food}</Text>
          <Text className='time'>
            {record.createdAt.toLocaleString('zh-CN', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        <View className='info-section'>
          <View className='info-item'>
            <Text className='label'>份量</Text>
            <Text className='value'>{record.count} {record.unit}</Text>
          </View>

          {record.nutrients && (
            <>
              <View className='info-item'>
                <Text className='label'>热量</Text>
                <Text className='value'>{record.nutrients.calories} kcal</Text>
              </View>
              <View className='info-item'>
                <Text className='label'>蛋白质</Text>
                <Text className='value'>{record.nutrients.protein}g</Text>
              </View>
              <View className='info-item'>
                <Text className='label'>碳水</Text>
                <Text className='value'>{record.nutrients.carbohydrates}g</Text>
              </View>
              <View className='info-item'>
                <Text className='label'>脂肪</Text>
                <Text className='value'>{record.nutrients.fat}g</Text>
              </View>
            </>
          )}
        </View>

        {record.description && (
          <View className='description'>
            <Text className='label'>备注</Text>
            <Text className='content'>{record.description}</Text>
          </View>
        )}
      </View>
    </View>
  )
}
