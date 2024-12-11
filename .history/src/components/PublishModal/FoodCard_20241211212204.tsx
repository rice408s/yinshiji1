import { View, Text, Image, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import './FoodCard.scss'

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

  const handleNutrientChange = (field: keyof typeof data.nutrients, value: string) => {
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
        <Image className='food-image' src={imageUrl} mode='aspectFill' />
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
                {editable && <Text className='edit-icon'>✎</Text>}
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

