import { View, Text, Input, Textarea, Image, Picker } from '@tarojs/components'
import { useRouter, showToast, navigateBack , cloud } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { formatDate } from '../../../utils/format'
import { formatDateTime, localToUTC } from '../../utils/date'

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
  const [record, setRecord] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  useEffect(() => {
    if (!id) return
    fetchRecord()
  }, [id])

  useEffect(() => {
    if (record?.createdAt) {
      const { date, time } = formatDateTime(record.createdAt)
      setSelectedDate(date)
      setSelectedTime(time)
    }
  }, [record])

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
        setRecord(record)
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
        description: description.trim()
      }

      // 添加时间
      if (selectedDate && selectedTime) {
        data.createdAt = localToUTC(selectedDate, selectedTime)
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

  // 处理日期选择
  const onDateChange = (e) => {
    setSelectedDate(e.detail.value)
  }

  // 处理时间选择
  const onTimeChange = (e) => {
    setSelectedTime(e.detail.value)
  }

  // 处理提交
  const handleSubmit = async () => {
    // 合并日期和时间
    const dateTime = new Date(`${selectedDate} ${selectedTime}`)

    try {
      const res = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'updateRecord',
          id,
          data: {
            ...formData,
            createdAt: dateTime
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
      }
    } catch (err) {
      showToast({
        title: '保存失败',
        icon: 'error'
      })
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

        <View className='edit-section'>
          <Text className='section-title'>记录时间</Text>
          <View className='time-picker-group'>
            <Picker
              mode='date'
              value={selectedDate}
              onChange={onDateChange}
              className='picker-item'
            >
              <View className='picker-value'>
                <Text className='label'>日期</Text>
                <Text className='value'>{selectedDate || '请选择日期'}</Text>
              </View>
            </Picker>

            <Picker
              mode='time'
              value={selectedTime}
              onChange={onTimeChange}
              className='picker-item'
            >
              <View className='picker-value'>
                <Text className='label'>时间</Text>
                <Text className='value'>{selectedTime || '请选择时间'}</Text>
              </View>
            </Picker>
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
