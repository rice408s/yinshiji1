import { View } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Header from './Header'
import ImageUploader from './ImageUploader'
import DescriptionInput from './DescriptionInput'
import './index.scss'

interface Props {
  visible: boolean
  onClose: (isComplete?: boolean) => void
}

export default function PublishModal({ visible, onClose }: Props) {
  const [isClosing, setIsClosing] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (visible) {
      setShowContent(true)
    } else {
      handleClose()
    }
  }, [visible])

  const handleClose = (isComplete = false) => {
    setIsClosing(true)
    // 等待动画结束后再隐藏内容
    setTimeout(() => {
      setShowContent(false)
      setIsClosing(false)
      onClose(isComplete)
    }, 200) // 动画时长
  }

  const handleMaskClick = (e) => {
    // 确保点击的是遮罩层而不是内容区域
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!showContent) return null

  return (
    <View
      className={`publish-modal ${visible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}
      onClick={handleMaskClick}
      catchMove
    >
      <View className='modal-content'>
        <Header onClose={() => handleClose()} />
        <View className='modal-body'>
          <ImageUploader onComplete={(result) => handleClose(true)} />
          <DescriptionInput />
        </View>
      </View>
    </View>
  )
}
