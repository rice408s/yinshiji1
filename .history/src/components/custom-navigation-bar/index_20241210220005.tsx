import { View, Text, Image } from '@tarojs/components'
import { Component } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

interface IProps {
  backgroundColor?: string
  background?: string
  barStyle?: '1' | '2' | '3'
  color?: string
  children?: React.ReactNode
}

export default class CustomNavigationBar extends Component<IProps> {
  state = {
    system: {
      statusBarHeight: 0,
      navigationBarHeight: 44,
      menuButtonHeight: 32,
      menuButtonWidth: 87,
    }
  }

  componentDidMount() {
    // 获取系统信息
    const systemInfo = Taro.getSystemInfoSync()
    const menuButton = Taro.getMenuButtonBoundingClientRect()

    this.setState({
      system: {
        statusBarHeight: systemInfo.statusBarHeight,
        navigationBarHeight: 44,
        menuButtonHeight: menuButton.height,
        menuButtonWidth: menuButton.width,
      }
    })
  }

  handleBack = () => {
    Taro.navigateBack()
  }

  render() {
    const { backgroundColor, background, barStyle = '1', color = '#fff', children } = this.props
    const { system } = this.state

    return (
      <View className='custom-nav' style={{ color }}>
        {/* 状态栏 */}
        <View
          className='status-bar'
          style={{
            height: `${system.statusBarHeight}px`,
            backgroundColor,
            background
          }}
        />

        {/* 导航栏 */}
        <View
          className='navigation-bar'
          style={{
            height: `${system.navigationBarHeight}px`,
            backgroundColor,
            background
          }}
        >
          {barStyle === '1' && (
            <View className='nav-content'>
              <View className='back' onClick={this.handleBack}>
                <View className='icon' style={{ borderColor: color }} />
              </View>
              <View className='content'>
                {children}
              </View>
            </View>
          )}

          {barStyle === '2' && (
            <View className='nav-content center'>
              {children}
            </View>
          )}

          {barStyle === '3' && (
            <View className='nav-content transparent'>
              {children}
            </View>
          )}
        </View>

        {/* 占位 */}
        {barStyle !== '3' && (
          <>
            <View className='status-placeholder' style={{ height: `${system.statusBarHeight}px` }} />
            <View className='nav-placeholder' style={{ height: `${system.navigationBarHeight}px` }} />
          </>
        )}
      </View>
    )
  }
}
