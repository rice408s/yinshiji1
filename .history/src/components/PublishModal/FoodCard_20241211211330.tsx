import { View, Text, Image, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'

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
        <View className='food-title'>
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
          {(editedData.count || editedData.unit) && (
            <View className='amount-inputs'>
              {editable ? (
                <>
                  <Input
                    className='count-input'
                    type='number'
                    value={String(editedData.count || '')}
                    onInput={e => handleDataChange('count', parseFloat(e.detail.value) || undefined)}
                  />
                  <Input
                    className='unit-input'
                    value={editedData.unit || ''}
                    onInput={e => handleDataChange('unit', e.detail.value)}
                  />
                </>
              ) : (
                <Text className='food-amount'>{editedData.count}{editedData.unit}</Text>
              )}
            </View>
          )}
        </View>
      </View>

      {editedData.nutrients && (
        <View className='nutrients-list'>
          <View className='nutrient-item'>
            <View className='nutrient-icon calories'>🔥</View>
            <View className='nutrient-detail'>
              <Text className='label'>热量</Text>
              {editable ? (
                <Input
                  className='nutrient-input'
                  type='digit'
                  value={String(editedData.nutrients.calories)}
                  onInput={e => handleNutrientChange('calories', e.detail.value)}
                />
              ) : (
                <Text className='value'>{editedData.nutrients.calories}<Text className='unit'>千卡</Text></Text>
              )}
            </View>
          </View>
          <View className='nutrient-item'>
            <View className='nutrient-icon carbs'>🌾</View>
            <View className='nutrient-detail'>
              <Text className='label'>碳水</Text>
              {editable ? (
                <Input
                  className='nutrient-input'
                  type='digit'
                  value={String(editedData.nutrients.carbohydrates)}
                  onInput={e => handleNutrientChange('carbohydrates', e.detail.value)}
                />
              ) : (
                <Text className='value'>{editedData.nutrients.carbohydrates}<Text className='unit'>克</Text></Text>
              )}
            </View>
          </View>
          <View className='nutrient-item'>
            <View className='nutrient-icon protein'>🥩</View>
            <View className='nutrient-detail'>
              <Text className='label'>蛋白质</Text>
              {editable ? (
                <Input
                  className='nutrient-input'
                  type='digit'
                  value={String(editedData.nutrients.protein)}
                  onInput={e => handleNutrientChange('protein', e.detail.value)}
                />
              ) : (
                <Text className='value'>{editedData.nutrients.protein}<Text className='unit'>克</Text></Text>
              )}
            </View>
          </View>
          <View className='nutrient-item'>
            <View className='nutrient-icon fat'>🥑</View>
            <View className='nutrient-detail'>
              <Text className='label'>脂肪</Text>
              {editable ? (
                <Input
                  className='nutrient-input'
                  type='digit'
                  value={String(editedData.nutrients.fat)}
                  onInput={e => handleNutrientChange('fat', e.detail.value)}
                />
              ) : (
                <Text className='value'>{editedData.nutrients.fat}<Text className='unit'>克</Text></Text>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
