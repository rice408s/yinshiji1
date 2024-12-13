import { View, Text, Canvas } from '@tarojs/components'
import { useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

interface Props {
  protein: number
  fat: number
  carbs: number
  calories: number
  caloriesGoal?: number
}

export default function StatsCard({
  protein,
  fat,
  carbs,
  calories,
  caloriesGoal = 2000
}: Props) {
  const caloriesPercent = Math.min((calories / caloriesGoal) * 100, 100)

  useEffect(() => {
    const ctx = Taro.createCanvasContext('calories-ring')
    const centerX = 70
    const centerY = 70
    const radius = 60

    // 绘制背景圆环
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.setLineWidth(8)
    ctx.setStrokeStyle('#f0f0f0')
    ctx.stroke()

    // 绘制进度圆环
    const endAngle = (caloriesPercent / 100) * 2 * Math.PI - Math.PI / 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle)
    ctx.setLineWidth(8)
    ctx.setStrokeStyle('#1890ff')
    ctx.stroke()

    ctx.draw()
  }, [caloriesPercent])

  return (
    <View className='stats-card'>
      <View className='calories-ring'>
        <Canvas
          type='2d'
          id='calories-ring'
          canvasId='calories-ring'
          className='ring-canvas'
        />
        <View className='ring-content'>
          <Text className='value'>{calories.toFixed(0)}</Text>
          <Text className='label'>已摄入</Text>
        </View>
      </View>

      <View className='nutrients-bars'>
        <View className='bar-item'>
          <View className='label'>蛋白质</View>
          <View className='bar-wrapper'>
            <View className='bar protein' style={{ height: `${(protein / 100) * 100}%` }} />
          </View>
          <View className='value'>{protein.toFixed(1)}</View>
        </View>
        <View className='bar-item'>
          <View className='label'>脂肪</View>
          <View className='bar-wrapper'>
            <View className='bar fat' style={{ height: `${(fat / 100) * 100}%` }} />
          </View>
          <View className='value'>{fat.toFixed(1)}</View>
        </View>
        <View className='bar-item'>
          <View className='label'>碳水</View>
          <View className='bar-wrapper'>
            <View className='bar carbs' style={{ height: `${(carbs / 200) * 100}%` }} />
          </View>
          <View className='value'>{carbs.toFixed(1)}</View>
        </View>
      </View>
    </View>
  )
}
