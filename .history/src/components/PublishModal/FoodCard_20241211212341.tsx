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
          <View className='nutrient-item calories'>
            <View className='nutrient-label'>
              <Text className='icon'>🔥</Text>
              <Text>热量</Text>
            </View>
            <View className='nutrient-value'>
              <Input
                className='value-input'
                type='digit'
                value={String(editedData.nutrients.calories)}
                onInput={e => handleNutrientChange('calories', e.detail.value)}
              />
              <Text className='unit'>千卡</Text>
            </View>
          </View>

          <View className='nutrient-item protein'>
            <View className='nutrient-label'>
              <Text className='icon'>🥩</Text>
              <Text>蛋白质</Text>
            </View>
            <View className='nutrient-value'>
              <Input
                className='value-input'
                type='digit'
                value={String(editedData.nutrients.protein)}
                onInput={e => handleNutrientChange('protein', e.detail.value)}
              />
              <Text className='unit'>克</Text>
            </View>
          </View>

          <View className='nutrient-item fat'>
            <View className='nutrient-label'>
              <Text className='icon'>🥑</Text>
              <Text>脂肪</Text>
            </View>
            <View className='nutrient-value'>
              <Input
                className='value-input'
                type='digit'
                value={String(editedData.nutrients.fat)}
                onInput={e => handleNutrientChange('fat', e.detail.value)}
              />
              <Text className='unit'>克</Text>
            </View>
          </View>

          <View className='nutrient-item carbs'>
            <View className='nutrient-label'>
              <Text className='icon'>🌾</Text>
              <Text>碳水</Text>
            </View>
            <View className='nutrient-value'>
              <Input
                className='value-input'
                type='digit'
                value={String(editedData.nutrients.carbohydrates)}
                onInput={e => handleNutrientChange('carbohydrates', e.detail.value)}
              />
              <Text className='unit'>克</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

