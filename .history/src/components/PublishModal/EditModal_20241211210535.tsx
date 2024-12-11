import { View, Text, Input, Button } from '@tarojs/components'
import { useState } from 'react'

interface Props {
  visible: boolean
  data: FoodData
  onClose: () => void
  onConfirm: (data: FoodData) => void
}

export default function EditModal({ visible, data, onClose, onConfirm }: Props) {
  const [editData, setEditData] = useState<FoodData>(data)

  if (!visible) return null

  return (
    <View className='edit-modal' onClick={onClose}>
      <View className='edit-content' onClick={e => e.stopPropagation()}>
        <View className='edit-header'>
          <Text className='title'>编辑食物信息</Text>
        </View>

        <View className='edit-form'>
          <View className='form-item'>
            <Text className='label'>食物名称</Text>
            <Input
              className='input'
              value={editData.food}
              onInput={e => setEditData(prev => ({ ...prev, food: e.detail.value }))}
            />
          </View>

          <View className='form-item'>
            <Text className='label'>数量</Text>
            <Input
              className='input'
              type='number'
              value={String(editData.count || '')}
              onInput={e => setEditData(prev => ({ ...prev, count: Number(e.detail.value) }))}
            />
          </View>

          <View className='form-item'>
            <Text className='label'>单位</Text>
            <Input
              className='input'
              value={editData.unit || ''}
              onInput={e => setEditData(prev => ({ ...prev, unit: e.detail.value }))}
            />
          </View>

          {editData.nutrients && (
            <>
              <View className='form-item'>
                <Text className='label'>热量 (千卡)</Text>
                <Input
                  className='input'
                  type='number'
                  value={String(editData.nutrients.calories)}
                  onInput={e => setEditData(prev => ({
                    ...prev,
                    nutrients: {
                      ...prev.nutrients!,
                      calories: Number(e.detail.value)
                    }
                  }))}
                />
              </View>

              <View className='form-item'>
                <Text className='label'>蛋白质 (克)</Text>
                <Input
                  className='input'
                  type='number'
                  value={String(editData.nutrients.protein)}
                  onInput={e => setEditData(prev => ({
                    ...prev,
                    nutrients: {
                      ...prev.nutrients!,
                      protein: Number(e.detail.value)
                    }
                  }))}
                />
              </View>

              {/* 其他营养成分输入框... */}
            </>
          )}
        </View>

        <View className='edit-actions'>
          <Button className='btn cancel' onClick={onClose}>取消</Button>
          <Button
            className='btn confirm'
            onClick={() => onConfirm(editData)}
          >
            确定
          </Button>
        </View>
      </View>
    </View>
  )
}
