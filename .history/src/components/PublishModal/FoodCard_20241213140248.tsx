import { View, Text, Image, Input } from '@tarojs/components'
import { useState } from 'react'
import './FoodCard.scss'

// 简化的食物数据接口
interface FoodData {
  food: string
  count?: number
  unit?: string
}

interface Props {
  imageUrl: string
  data: FoodData
  onDelete?: () => void
  onChange?: (newData: FoodData) => void
  editable?: boolean
}

export default function FoodCard({ imageUrl, data, onDelete, onChange, editable = false }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(data)

  // 处理食物名称修改
  const handleFoodNameChange = (e: any) => {
    const newData = { ...editData, food: e.detail.value }
    setEditData(newData)
    onChange?.(newData)
  }

  // 处理数量修改
  const handleCountChange = (e: any) => {
    const count = parseInt(e.detail.value) || undefined
    const newData = { ...editData, count }
    setEditData(newData)
    onChange?.(newData)
  }

  // 处理单位修改
  const handleUnitChange = (e: any) => {
    const newData = { ...editData, unit: e.detail.value }
    setEditData(newData)
    onChange?.(newData)
  }

  return (
    <View className='food-card'>
      <View className='food-header'>
        <Image className='food-image' src={imageUrl} mode='aspectFill' />
        <View className='food-info'>
          {editable ? (
            <View className='food-name-wrapper'>
              {isEditing ? (
                <Input
                  className='food-name-input'
                  value={editData.food}
                  onInput={handleFoodNameChange}
                  onBlur={() => setIsEditing(false)}
                  focus
                />
              ) : (
                <Text
                  className='food-name'
                  onClick={() => setIsEditing(true)}
                >
                  {editData.food}
                  <Text className='edit-icon'>✎</Text>
                </Text>
              )}
            </View>
          ) : (
            <Text className='food-name'>{data.food}</Text>
          )}

          {editable ? (
            <View className='amount-wrapper'>
              <Input
                className='amount-input'
                type='number'
                value={String(editData.count || '')}
                onInput={handleCountChange}
                placeholder='数量'
              />
              <Input
                className='amount-input'
                value={editData.unit || ''}
                onInput={handleUnitChange}
                placeholder='单位'
              />
            </View>
          ) : (
            (data.count || data.unit) && (
              <Text className='food-amount'>
                {data.count} {data.unit}
              </Text>
            )
          )}
        </View>
        {onDelete && (
          <View className='delete-btn' onClick={onDelete}>
            <Text className='icon'>✕</Text>
          </View>
        )}
      </View>

      {editable && (
        <View className='edit-hint'>
          <Text className='icon'>💡</Text>
          <Text>点击文字可以编辑</Text>
        </View>
      )}
    </View>
  )
}

