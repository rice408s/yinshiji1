import { createApp } from '@tarojs/taro'
import './app.scss'

const App = createApp({
  onLaunch() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        env: 'your-env-id', // 替换为你的云开发环境ID
        traceUser: true
      })
    }
  }
})

export default App
