import { View, Text, Image, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import './index.scss'

interface NutrientsType {
  calories: number
  carbohydrates: number
  protein: number
  fat: number
}

interface FoodData {
  food: string
  count?: number
  unit?: string
  nutrients?: NutrientsType
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
  const [activeField, setActiveField] = useState<string | null>(null)

  useEffect(() => {
    setEditedData(data)
  }, [data])

  const handleDataChange = (field: keyof FoodData, value: any) => {
    const newData = { ...editedData, [field]: value }
    setEditedData(newData)
    onDataChange?.(newData)
  }

  const handleNutrientChange = (field: keyof NutrientsType, value: string) => {
    const numValue = parseFloat(value) || 0
    const newNutrients = {
      ...editedData.nutrients,
      [field]: numValue
    }
    handleDataChange('nutrients', newNutrients)
  }

  const nutrientItems = [
    { key: 'calories', label: '热量', icon: '🔥', unit: '千卡', color: '#FF6B6B' },
    { key: 'protein', label: '蛋白质', icon: '🥩', unit: '克', color: '#4ECDC4' },
    { key: 'fat', label: '脂肪', icon: '🥑', unit: '克', color: '#FFD93D' },
    { key: 'carbohydrates', label: '碳水', icon: '🌾', unit: '克', color: '#95DE64' }
  ]

  return (
    <View className='food-card'>
      {editable && (
        <View className='edit-hint'>
          <Text className='icon'>✏️</Text>
          <Text>点击内容可编辑</Text>
        </View>
      )}

      <View className='food-header'>
        <View className='image-wrapper'>
          <Image className='food-image' src={imageUrl} mode='aspectFill' />
        </View>

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
              <View
                className={classNames('food-name', { 'editable': editable })}
                onClick={() => editable && setIsEditing(true)}
              >
                <Text>{editedData.food}</Text>
                {editable && <Text className='edit-icon'>✎</Text>}
              </View>
            )}
          </View>

          <View className='amount-group'>
            <Input
              className={classNames('amount-input', { 'active': activeField === 'count' })}
              type='number'
              value={String(editedData.count || '')}
              onInput={e => handleDataChange('count', parseFloat(e.detail.value) || undefined)}
              onFocus={() => setActiveField('count')}
              onBlur={() => setActiveField(null)}
              placeholder='数量'
            />
            <Input
              className={classNames('unit-input', { 'active': activeField === 'unit' })}
              value={editedData.unit || ''}
              onInput={e => handleDataChange('unit', e.detail.value)}
              onFocus={() => setActiveField('unit')}
              onBlur={() => setActiveField(null)}
              placeholder='单位'
            />
          </View>
        </View>
      </View>

      {editedData.nutrients && (
        <View className='nutrients-grid'>
          {nutrientItems.map(item => (
            <View
              key={item.key}
              className={classNames('nutrient-item', item.key)}
              style={{ '--highlight-color': item.color } as any}
            >
              <View className='nutrient-label'>
                <Text className='icon'>{item.icon}</Text>
                <Text>{item.label}</Text>
              </View>
              <View className='nutrient-value'>
                <Input
                  className={classNames('value-input', {
                    'active': activeField === item.key
                  })}
                  type='digit'
                  value={String(editedData.nutrients[item.key as keyof NutrientsType])}
                  onInput={e => handleNutrientChange(item.key as keyof NutrientsType, e.detail.value)}
                  onFocus={() => setActiveField(item.key)}
                  onBlur={() => setActiveField(null)}
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

