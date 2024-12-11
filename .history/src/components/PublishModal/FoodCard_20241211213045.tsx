import { View, Text, Image, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import './index.scss'

interface Nutrients {
  calories: number
  carbohydrates: number
  protein: number
  fat: number
}

interface FoodData {
  food: string
  count?: number
  unit?: string
  nutrients?: Nutrients
}

interface Props {
  imageUrl: string
  data: FoodData
  onDataChange?: (newData: FoodData) => void
  editable?: boolean
}

export default function FoodCard({ imageUrl, data, onDataChange, editable = true }: Props) {
  const [editedData, setEditedData] = useState<FoodData>(data)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setEditedData(data)
  }, [data])

  const handleDataChange = (field: keyof FoodData, value: any) => {
    const newData = { ...editedData, [field]: value }
    setEditedData(newData)
    onDataChange?.(newData)
  }

  const handleNutrientChange = (field: keyof Nutrients, value: string) => {
    const numValue = parseFloat(value) || 0
    const newNutrients = {
      ...editedData.nutrients,
      [field]: numValue
    }
    handleDataChange('nutrients', newNutrients)
  }

  return (
    <View className='food-card'>
      <View className='food-header'>
        <Image
          className='food-image'
          src={imageUrl}
          mode='aspectFill'
          lazyLoad
        />
        <View className='food-info'>
          <View className='food-name-wrapper'>
            {editable && isEditing ? (
              <Input
                className='food-name-input'
                value={editedData.food}
                onInput={e => handleDataChange('food', e.detail.value)}
                onBlur={() => setIsEditing(false)}
                focus
              />
            ) : (
              <Text
                className='food-name'
                onClick={() => editable && setIsEditing(true)}
              >
                {editedData.food}
              </Text>
            )}
          </View>

          <View className='amount-wrapper'>
            <Input
              className='amount-input'
              type='number'
              value={String(editedData.count || '')}
              onInput={e => handleDataChange('count', parseFloat(e.detail.value) || undefined)}
              placeholder='数量'
            />
            <Input
              className='amount-input'
              value={editedData.unit || ''}
              onInput={e => handleDataChange('unit', e.detail.value)}
              placeholder='单位'
            />
          </View>
        </View>
      </View>

      {editedData.nutrients && (
        <View className='nutrients-grid'>
          {[
            { key: 'calories', label: '热量', icon: '🔥', unit: '千卡' },
            { key: 'protein', label: '蛋白质', icon: '🥩', unit: '克' },
            { key: 'fat', label: '脂肪', icon: '🥑', unit: '克' },
            { key: 'carbohydrates', label: '碳水', icon: '🌾', unit: '克' }
          ].map(item => (
            <View key={item.key} className={`nutrient-item ${item.key}`}>
              <View className='nutrient-label'>
                <Text className='icon'>{item.icon}</Text>
                <Text>{item.label}</Text>
              </View>
              <View className='nutrient-value'>
                <Input
                  className='value-input'
                  type='digit'
                  value={String(editedData.nutrients?.[item.key as keyof Nutrients] ?? '')}
                  onInput={e => handleNutrientChange(item.key as keyof Nutrients, e.detail.value)}
                />
                <Text className='unit'>{item.unit}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

