import { View, Text, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import './EditFoodModal.scss'
import { formatLocalTime } from '../../utils/date'

interface FoodData {
  food: string
  count?: number
  unit?: string
  time?: string
}

interface FormErrors {
  food?: string
  count?: string
  hour?: string
  minute?: string
}

interface Props {
  visible: boolean
  data: FoodData
  onClose: () => void
  onSave: (data: FoodData) => void
}

const EditFoodModal = ({ visible, data, onClose, onSave }: Props) => {
  const [editData, setEditData] = useState<FoodData>(data)
  const [isVisible, setIsVisible] = useState(false)
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (data.time) {
      const [h, m] = data.time.split(':')
      setHour(h)
      setMinute(m)
    } else {
      const now = new Date()
      setHour(now.getUTCHours().toString().padStart(2, '0'))
      setMinute(now.getUTCMinutes().toString().padStart(2, '0'))
    }
    setEditData(data)
  }, [data])

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!editData.food.trim()) {
      newErrors.food = '请输入食物名称'
    }

    if (editData.count !== undefined && (editData.count < 0 || editData.count > 9999)) {
      newErrors.count = '数量需在0-9999之间'
    }

    if (!hour && !minute) {
      newErrors.hour = '请填写时间'
    } else {
      const hourNum = parseInt(hour)
      const minuteNum = parseInt(minute)

      if (isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
        newErrors.hour = '小时需在0-23之间'
      }

      if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
        newErrors.minute = '分钟需在0-59之间'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const formattedHour = hour.padStart(2, '0')
    const formattedMinute = minute.padStart(2, '0')
    const timeString = `${formattedHour}:${formattedMinute}`

    onSave({
      ...editData,
      time: timeString
    })
    onClose()
  }

  const handleTimeInput = (value: string, type: 'hour' | 'minute') => {
    if (!value) {
      if (type === 'hour') {
        setHour('')
        setErrors(prev => ({ ...prev, hour: undefined }))
      } else {
        setMinute('')
        setErrors(prev => ({ ...prev, minute: undefined }))
      }
      return
    }

    const numValue = value.replace(/[^\d]/g, '')

    if (type === 'hour') {
      const hourNum = parseInt(numValue)
      if (!numValue || (!isNaN(hourNum) && hourNum >= 0 && hourNum <= 23)) {
        setHour(numValue)
        setErrors(prev => ({ ...prev, hour: undefined }))
      }
    } else {
      const minuteNum = parseInt(numValue)
      if (!numValue || (!isNaN(minuteNum) && minuteNum >= 0 && minuteNum <= 59)) {
        setMinute(numValue)
        setErrors(prev => ({ ...prev, minute: undefined }))
      }
    }
  }

  if (!visible && !isVisible) return null

  return (
    <View
      className={classNames('edit-food-modal', { visible })}
      catchMove
      onClick={e => e.stopPropagation()}
    >
      <View
        className='mask'
        onClick={e => {
          e.stopPropagation()
          onClose()
        }}
      />
      <View
        className='drawer'
        onClick={e => e.stopPropagation()}
      >
        <View className='drawer-header'>
          <Text className='title'>编辑食物信息</Text>
        </View>

        <View className='drawer-content'>
          <View className='form-item inline-group'>
            <View className='input-wrapper name-input'>
              <Input
                className={classNames('input', { error: errors.food })}
                value={editData.food}
                onInput={e => {
                  setEditData(prev => ({ ...prev, food: e.detail.value }))
                  setErrors(prev => ({ ...prev, food: undefined }))
                }}
                placeholder='食物名称'
                focus
              />
              {errors.food && <Text className='error-text'>{errors.food}</Text>}
            </View>

            <View className='input-wrapper'>
              <Input
                className={classNames('input', { error: errors.count })}
                type='number'
                value={editData.count?.toString() || ''}
                onInput={e => {
                  const value = e.detail.value ? parseInt(e.detail.value) : undefined
                  setEditData(prev => ({ ...prev, count: value }))
                  setErrors(prev => ({ ...prev, count: undefined }))
                }}
                placeholder='数量'
              />
              {errors.count && <Text className='error-text'>{errors.count}</Text>}
            </View>

            <View className='input-wrapper'>
              <Input
                className='input'
                value={editData.unit || ''}
                onInput={e => setEditData(prev => ({ ...prev, unit: e.detail.value }))}
                placeholder='单位'
              />
            </View>
          </View>

          <View className='form-item'>
            <View className='time-inputs'>
              <View className='time-input-group'>
                <Input
                  className={classNames('time-input', { error: errors.hour })}
                  type='number'
                  maxlength={2}
                  value={hour}
                  onInput={e => handleTimeInput(e.detail.value, 'hour')}
                  placeholder='时'
                />
                <Text className='time-separator'>:</Text>
                <Input
                  className={classNames('time-input', { error: errors.minute })}
                  type='number'
                  maxlength={2}
                  value={minute}
                  onInput={e => handleTimeInput(e.detail.value, 'minute')}
                  placeholder='分'
                />
              </View>
              {(errors.hour || errors.minute) && (
                <Text className='error-text'>{errors.hour || errors.minute}</Text>
              )}
            </View>
          </View>
        </View>

        <View className='drawer-footer'>
          <View className='btn cancel-btn' onClick={onClose}>取消</View>
          <View className='btn confirm-btn' onClick={handleSave}>确定</View>
        </View>
      </View>
    </View>
  )
}

export default EditFoodModal
