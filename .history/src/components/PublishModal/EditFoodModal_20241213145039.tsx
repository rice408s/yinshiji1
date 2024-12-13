import { View, Text, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import './EditFoodModal.scss'

interface FoodData {
  food: string
  count?: number
  unit?: string
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

  useEffect(() => {
    setEditData(data)
  }, [data])

  useEffect(() => {
    if (visible) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [visible])

  const handleSave = () => {
    if (!editData.food.trim()) return
    onSave(editData)
    onClose()
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
          <View className='close-btn' onClick={onClose}>✕</View>
        </View>

        <View className='drawer-content'>
          <View className='form-item'>
            <Text className='label'>食物名称</Text>
            <Input
              className='input'
              value={editData.food}
              onInput={e => setEditData(prev => ({ ...prev, food: e.detail.value }))}
              placeholder='请输入食物名称'
              focus
            />
          </View>

          <View className='form-item'>
            <Text className='label'>数量</Text>
            <Input
              className='input'
              type='number'
              value={editData.count?.toString() || ''}
              onInput={e => setEditData(prev => ({
                ...prev,
                count: e.detail.value ? parseInt(e.detail.value) : undefined
              }))}
              placeholder='请输入数量'
            />
          </View>

          <View className='form-item'>
            <Text className='label'>单位</Text>
            <Input
              className='input'
              value={editData.unit || ''}
              onInput={e => setEditData(prev => ({ ...prev, unit: e.detail.value }))}
              placeholder='请输入单位'
            />
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
