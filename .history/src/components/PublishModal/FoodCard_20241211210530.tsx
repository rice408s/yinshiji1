import { View, Text, Image, Button } from '@tarojs/components'
import { useState } from 'react'
import EditModal from './EditModal'

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
  onEdit?: (editedData: FoodData) => void
  onDelete?: () => void
}

export default function FoodCard({ imageUrl, data, onEdit, onDelete }: Props) {
  const [showEditModal, setShowEditModal] = useState(false)

  return (
    <>
      <View className='food-card'>
        <View className='food-header'>
          <Image className='food-image' src={imageUrl} mode='aspectFill' />
          <View className='food-title'>
            <Text className='food-name'>{data.food}</Text>
            {data.count && data.unit && (
              <Text className='food-amount'>{data.count}{data.unit}</Text>
            )}
          </View>
        </View>

        {data.nutrients && (
          <View className='nutrients-list'>
            <View className='nutrient-item'>
              <View className='nutrient-icon calories'>🔥</View>
              <View className='nutrient-detail'>
                <Text className='label'>热量</Text>
                <Text className='value'>{data.nutrients.calories}<Text className='unit'>千卡</Text></Text>
              </View>
            </View>
            <View className='nutrient-item'>
              <View className='nutrient-icon carbs'>🌾</View>
              <View className='nutrient-detail'>
                <Text className='label'>碳水</Text>
                <Text className='value'>{data.nutrients.carbohydrates}<Text className='unit'>克</Text></Text>
              </View>
            </View>
            <View className='nutrient-item'>
              <View className='nutrient-icon protein'>🥩</View>
              <View className='nutrient-detail'>
                <Text className='label'>蛋白质</Text>
                <Text className='value'>{data.nutrients.protein}<Text className='unit'>克</Text></Text>
              </View>
            </View>
            <View className='nutrient-item'>
              <View className='nutrient-icon fat'>🥑</View>
              <View className='nutrient-detail'>
                <Text className='label'>脂肪</Text>
                <Text className='value'>{data.nutrients.fat}<Text className='unit'>克</Text></Text>
              </View>
            </View>
          </View>
        )}

        <View className='card-actions'>
          <Button
            className='action-btn edit'
            onClick={() => setShowEditModal(true)}
          >
            编辑
          </Button>
          <Button
            className='action-btn delete'
            onClick={onDelete}
          >
            删除
          </Button>
        </View>
      </View>

      <EditModal
        visible={showEditModal}
        data={data}
        onClose={() => setShowEditModal(false)}
        onConfirm={(editedData) => {
          onEdit?.(editedData)
          setShowEditModal(false)
        }}
      />
    </>
  )
}
