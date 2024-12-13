import { View } from '@tarojs/components'
import { useState, useEffect, useCallback } from 'react'
import Header from './Header'
import DescriptionInput from './DescriptionInput'
import './index.scss'

interface Props {
  visible: boolean
  onClose: (isComplete?: boolean) => void
}

export default function PublishModal({ visible, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (visible) {
      setIsVisible(true)
      setIsClosing(false)
    } else {
      handleClose()
    }
  }, [visible])

  // 使用 useCallback 优化性能
  const handleClose = useCallback((isComplete = false) => {
    setIsClosing(true)
    // 等待动画结束后再关闭
    setTimeout(() => {
      setIsVisible(false)
      onClose(isComplete)
    }, 300) // 动画时长
  }, [onClose])

  // 防抖处理遮罩层点击
  const handleMaskClick = useCallback((e: any) => {
    if (e.target === e.currentTarget && !isClosing) {
      handleClose()
    }
  }, [handleClose, isClosing])

  if (!isVisible) return null

  return (
    <View
      className={`publish-modal ${isClosing ? 'closing' : ''}`}
      onClick={handleMaskClick}
      catchMove
    >
      <View className='modal-content'>
        <Header onClose={() => handleClose()} />
        <DescriptionInput onComplete={() => handleClose(true)} />
      </View>
    </View>
  )
}
