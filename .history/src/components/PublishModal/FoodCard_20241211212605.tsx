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

  const handleNutrientChange = (nutrient: keyof Nutrients, value: string) => {
    const numValue = parseFloat(value) || 0
    const newNutrients = {
      ...editedData.nutrients,
      [nutrient]: numValue
    }
    handleDataChange('nutrients', newNutrients)
  }

  const nutrientIcons = {
    calories: '🔥',
    protein: '🥩',
    fat: '🥑',
    carbs: '🌾'
  }

  const nutrientLabels = {
    calories: '热量',
    protein: '蛋白质',
    fat: '脂肪',
    carbs: '碳水'
  }

  const nutrientUnits = {
    calories: '千卡',
    protein: '克',
    fat: '克',
    carbs: '克'
  }

  return (
    <View className='food-card'>
      <View className='food-header'>
        <View className='food-image-wrapper'>
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
          {(Object.keys(nutrientIcons) as Array<keyof typeof nutrientIcons>).map(nutrient => (
            <View key={nutrient} className={`nutrient-item ${nutrient}`}>
              <View className='nutrient-label'>
                <Text className='icon'>{nutrientIcons[nutrient]}</Text>
                <Text className='text'>{nutrientLabels[nutrient]}</Text>
              </View>
              <View className='nutrient-value'>
                <Input
                  className='value-input'
                  type='digit'
                  value={String(editedData.nutrients[nutrient as keyof Nutrients])}
                  onInput={e => handleNutrientChange(nutrient as keyof Nutrients, e.detail.value)}
                />
                <Text className='unit'>{nutrientUnits[nutrient]}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

