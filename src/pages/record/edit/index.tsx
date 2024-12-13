import { View, Text, Input, Textarea, Image } from '@tarojs/components'
import { useRouter, showToast, navigateBack , cloud } from '@tarojs/taro'
import { useEffect, useState } from 'react'

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
  const [food, setFood] = useState('')
  const [count, setCount] = useState<string>('')
  const [unit, setUnit] = useState('')
  const [calories, setCalories] = useState<string>('')
  const [carbs, setCarbs] = useState<string>('')
  const [protein, setProtein] = useState<string>('')
  const [fat, setFat] = useState<string>('')
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
        setFood(record.food)
        setCount(record.count?.toString() || '')
        setUnit(record.unit || '')
        setCalories(record.nutrients?.calories?.toString() || '')
        setCarbs(record.nutrients?.carbohydrates?.toString() || '')
        setProtein(record.nutrients?.protein?.toString() || '')
        setFat(record.nutrients?.fat?.toString() || '')
        setDescription(record.description || '')
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
    if (!food.trim()) {
      showToast({
        title: '请输入食物名称',
        icon: 'none'
      })
      return
    }

    setSaving(true)

    try {
      const data: any = {
        food: food.trim(),
        description: description.trim(),
        updatedAt: new Date()
      }

      if (count) {
        data.count = parseFloat(count)
      }
      if (unit) {
        data.unit = unit.trim()
      }

      // 只有当所有营养成分都填写时才更新
      if (calories && carbs && protein && fat) {
        data.nutrients = {
          calories: parseFloat(calories),
          carbohydrates: parseFloat(carbs),
          protein: parseFloat(protein),
          fat: parseFloat(fat)
        }
      }

      const res: any = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'updateRecord',
          id,
          data
        }
      })

      if (res.result.code === 200) {
        showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1000
        })
        navigateBack()
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

  if (loading) {
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
        <Image
          className='food-image'
          src={imageUrl}
          mode='aspectFill'
        />

        <View className='form-card'>
          <View className='form-item'>
            <Text className='label'>食物名称</Text>
            <Input
              className='input'
              value={food}
              onInput={e => setFood(e.detail.value)}
              placeholder='请输入食物名称'
            />
          </View>

          <View className='form-row'>
            <View className='form-item flex-1'>
              <Text className='label'>份量</Text>
              <Input
                className='input'
                type='digit'
                value={count}
                onInput={e => setCount(e.detail.value)}
                placeholder='数量'
              />
            </View>
            <View className='form-item flex-1'>
              <Text className='label'>单位</Text>
              <Input
                className='input'
                value={unit}
                onInput={e => setUnit(e.detail.value)}
                placeholder='克/个/份'
              />
            </View>
          </View>

          <View className='form-section'>
            <Text className='section-title'>营养成分</Text>
            <View className='form-row'>
              <View className='form-item flex-1'>
                <Text className='label'>热量(kcal)</Text>
                <Input
                  className='input'
                  type='digit'
                  value={calories}
                  onInput={e => setCalories(e.detail.value)}
                  placeholder='0'
                />
              </View>
              <View className='form-item flex-1'>
                <Text className='label'>碳水(g)</Text>
                <Input
                  className='input'
                  type='digit'
                  value={carbs}
                  onInput={e => setCarbs(e.detail.value)}
                  placeholder='0'
                />
              </View>
            </View>
            <View className='form-row'>
              <View className='form-item flex-1'>
                <Text className='label'>蛋白质(g)</Text>
                <Input
                  className='input'
                  type='digit'
                  value={protein}
                  onInput={e => setProtein(e.detail.value)}
                  placeholder='0'
                />
              </View>
              <View className='form-item flex-1'>
                <Text className='label'>脂肪(g)</Text>
                <Input
                  className='input'
                  type='digit'
                  value={fat}
                  onInput={e => setFat(e.detail.value)}
                  placeholder='0'
                />
              </View>
            </View>
          </View>

          <View className='form-item'>
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
