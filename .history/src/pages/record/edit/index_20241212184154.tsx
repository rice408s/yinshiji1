import { View, Text, Image, Textarea } from '@tarojs/components'
import { useRouter, showToast, navigateBack } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { cloud } from '@tarojs/taro'
import FoodCard from '../../../components/PublishModal/FoodCard'
import './index.scss'

interface FoodData {
  food: string
  count?: number
  unit?: string
  nutrients?: {
    calories: number
    carbohydrates: number
    protein: number
    fat: number
  }
}

export default function RecordEdit() {
  const router = useRouter()
  const { id } = router.params
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [foodData, setFoodData] = useState<FoodData | null>(null)
  const [description, setDescription] = useState('')
  const [fileID, setFileID] = useState('')

  useEffect(() => {
    if (!id) return
    fetchRecord()
  }, [id])

  const fetchRecord = async () => {
    try {
      const res: any = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'getDetail',
          id
        }
      })

      if (res.result.code === 200 && res.result.data?.record) {
        const record = res.result.data.record
        setImageUrl(record.imageUrl)
        setFileID(record.fileID)
        setDescription(record.description || '')
        setFoodData({
          food: record.food,
          count: record.count,
          unit: record.unit,
          nutrients: record.nutrients
        })
      }
    } catch (err) {
      showToast({
        title: '获取记录失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)

    try {
      const res: any = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'updateRecord',
          id,
          data: {
            description,
            updatedAt: new Date()
          }
        }
      })

      if (res.result.code === 200) {
        showToast({
          title: '保存成功',
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
        title: '保存失败',
        icon: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !foodData) {
    return (
      <View className='record-page'>
        <View className='loading'>
          <View className='loading-spinner' />
          <Text>加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className='record-page'>
      <View className='content'>
        <FoodCard
          imageUrl={imageUrl}
          data={foodData}
        />

        <View className='form-card'>
          <Text className='label'>备注</Text>
          <Textarea
            className='textarea'
            value={description}
            onInput={e => setDescription(e.detail.value)}
            placeholder='添加备注...'
            maxlength={200}
            autoHeight
          />
        </View>

        <View className='action-buttons'>
          <View
            className={`btn save ${saving ? 'disabled' : ''}`}
            onClick={handleSave}
          >
            <Text className='icon'>✓</Text>
            <Text>{saving ? '保存中...' : '保存'}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
