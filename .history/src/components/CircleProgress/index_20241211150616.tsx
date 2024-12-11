import { View } from '@tarojs/components'
import './index.scss'

interface Props {
  progress: number  // 0-100
  size?: number     // 圆形大小
  strokeWidth?: number  // 进度条宽度
  color?: string    // 进度条颜色
}

export default function CircleProgress({
  progress,
  size = 120,
  strokeWidth = 4,
  color = '#1890ff'
}: Props) {
  // 计算圆形路径
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <View className='circle-progress' style={{ width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size}>
        {/* 背景圆 */}
        <circle
          className='circle-bg'
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill='none'
          strokeWidth={strokeWidth}
        />
        {/* 进度圆 */}
        <circle
          className='circle-progress-bar'
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill='none'
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={color}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <View className='progress-text'>{Math.round(progress)}%</View>
    </View>
  )
}
