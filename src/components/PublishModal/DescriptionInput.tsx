import { View, Textarea } from '@tarojs/components'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function DescriptionInput({ value, onChange }: Props) {
  return (
    <View className='input-section'>
      <Textarea
        className='description-input'
        value={value}
        onInput={e => onChange(e.detail.value)}
        placeholder='来点灵魂解说...'
        maxlength={200}
        autoHeight
        fixed
        adjustPosition
        holdKeyboard
        showConfirmBar={false}
        cursor-spacing={20}
      />
    </View>
  )
} 
