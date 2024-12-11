import { createApp } from '@tarojs/taro'
import { createEmptyIcon } from './utils/createEmptyIcon'
import { cloud } from '@tarojs/taro'
import './app.scss'

const App = createApp({
  onLaunch() {
    if (process.env.TARO_ENV === 'weapp') {
      cloud.init({
        env: cloud.DYNAMIC_CURRENT_ENV
      })

      // 生成并保存tabBar图标
      const fs = cloud.getFileSystemManager()
      const iconPaths = {
        home: './assets/icons/home.png',
        homeActive: './assets/icons/home-active.png',
        profile: './assets/icons/profile.png',
        profileActive: './assets/icons/profile-active.png'
      }

      Object.entries(iconPaths).forEach(([key, path]) => {
        const isActive = key.includes('Active')
        const iconData = createEmptyIcon(isActive ? '#07c160' : '#999999')
        try {
          fs.writeFileSync(path, iconData, 'base64')
        } catch (err) {
          console.error(`Failed to save icon ${path}:`, err)
        }
      })
    }
  }
})

export default App
