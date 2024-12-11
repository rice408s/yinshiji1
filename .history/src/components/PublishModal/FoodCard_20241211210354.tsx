import { View, Text, Image, Input } from '@tarojs/components'

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
  editable?: boolean
  onDataChange?: (newData: FoodData) => void
}

export default function FoodCard({ imageUrl, data, editable = false, onDataChange }: Props) {
  const handleChange = (key: keyof FoodData, value: any) => {
    if (!editable || !onDataChange) return
    onDataChange({
      ...data,
      [key]: value
    })
  }

  const handleNutrientChange = (key: keyof typeof data.nutrients, value: string) => {
    if (!editable || !onDataChange || !data.nutrients) return
    const numValue = parseFloat(value) || 0
    onDataChange({
      ...data,
      nutrients: {
        ...data.nutrients,
        [key]: numValue
      }
    })
  }

  return (
    <View className='food-card'>
      <View className='food-header'>
        <Image className='food-image' src={imageUrl} mode='aspectFill' />
        <View className='food-title'>
          {editable ? (
            <Input
              className='food-name-input'
              value={data.food}
              onInput={e => handleChange('food', e.detail.value)}
              placeholder='食物名称'
            />
          ) : (
            <Text className='food-name'>{data.food}</Text>
          )}
          {(data.count || data.unit) && (
            <View className='food-amount-wrapper'>
              {editable ? (
                <>
                  <Input
                    className='count-input'
                    type='number'
                    value={data.count?.toString()}
                    onInput={e => handleChange('count', parseFloat(e.detail.value) || 0)}
                    placeholder='数量'
                  />
                  <Input
                    className='unit-input'
                    value={data.unit}
                    onInput={e => handleChange('unit', e.detail.value)}
                    placeholder='单位'
                  />
                </>
              ) : (
                <Text className='food-amount'>{data.count}{data.unit}</Text>
              )}
            </View>
          )}
        </View>
      </View>

      {data.nutrients && (
        <View className='nutrients-list'>
          <View className='nutrient-item'>
            <View className='nutrient-icon calories'>🔥</View>
            <View className='nutrient-detail'>
              <Text className='label'>热量</Text>
              {editable ? (
                <Input
                  className='nutrient-input'
                  type='digit'
                  value={data.nutrients.calories.toString()}
                  onInput={e => handleNutrientChange('calories', e.detail.value)}
                />
              ) : (
                <Text className='value'>{data.nutrients.calories}<Text className='unit'>千卡</Text></Text>
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
                  value={data.nutrients.carbohydrates.toString()}
                  onInput={e => handleNutrientChange('carbohydrates', e.detail.value)}
                />
              ) : (
                <Text className='value'>{data.nutrients.carbohydrates}<Text className='unit'>克</Text></Text>
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
                  value={data.nutrients.protein.toString()}
                  onInput={e => handleNutrientChange('protein', e.detail.value)}
                />
              ) : (
                <Text className='value'>{data.nutrients.protein}<Text className='unit'>克</Text></Text>
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
                  value={data.nutrients.fat.toString()}
                  onInput={e => handleNutrientChange('fat', e.detail.value)}
                />
              ) : (
                <Text className='value'>{data.nutrients.fat}<Text className='unit'>克</Text></Text>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
