import { View, Image, Text } from '@tarojs/components'
import Taro, { useRouter, Config } from '@tarojs/taro'
// ... 其他导入保持不变

// 添加页面配置
export default class Record extends Taro.Component {
  config: Config = {
    navigationBarTitleText: '记录详情'
  }

  // ... 其他代码保持不变
}
