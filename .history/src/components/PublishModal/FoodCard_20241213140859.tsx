import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import EditFoodModal from './EditFoodModal'
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
  onChange?: (data: FoodData) => void
}

export default function FoodCard({ imageUrl, data, onDelete, onChange }: Props) {
  const [showEditModal, setShowEditModal] = useState(false)

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleSave = (newData: FoodData) => {
    onChange?.(newData)
  }

  return (
    <View className='food-card'>
      <View className='food-header'>
        <Image className='food-image' src={imageUrl} mode='aspectFill' />
        <View className='food-info'>
          <Text className='food-name'>{data.food}</Text>
          {(data.count || data.unit) && (
            <Text className='food-amount'>
              {data.count} {data.unit}
            </Text>
          )}
        </View>
        <View className='action-btns'>
          <View className='edit-btn' onClick={handleEdit}>
            <Text className='icon'>✎</Text>
          </View>
          {onDelete && (
            <View className='delete-btn' onClick={onDelete}>
              <Text className='icon'>✕</Text>
            </View>
          )}
        </View>
      </View>

      <EditFoodModal
        visible={showEditModal}
        data={data}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
      />
    </View>
  )
}

