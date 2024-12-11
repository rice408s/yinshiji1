const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 阿里云 API 配置
const ALIYUN_API = {
  endpoint: 'https://dashscope.aliyuncs.com/api/v1/apps',
  appId: '17adecaaf25041cabb3bf7564c5b7196',
  apiKey: 'sk-259a2ec00e1f4c52967676ad51fdbf45'
}

// 封装 wx.request 为 Promise
const request = (options) => {
  return new Promise((resolve, reject) => {
    cloud.callContainer({
      config: {
        env: cloud.DYNAMIC_CURRENT_ENV
      },
      path: options.url,
      method: options.method,
      header: options.headers,
      data: options.data,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, fileID, user_input } = event

  switch (action) {
    case 'uploadImage':
      // 获取图片临时链接并添加压缩样式
      try {
        const { fileList } = await cloud.getTempFileURL({
          fileList: [fileID]
        })
        const url = fileList[0].tempFileURL
        return {
          code: 200,
          data: {
            url: `${url}/zip`,  // 添加压缩样式
            fileID
          }
        }
      } catch (err) {
        console.error('获取图片链接失败:', err)
        return {
          code: 500,
          message: '获取图片链接失败'
        }
      }

    case 'analyzeFood':
      try {
        console.log('开始API调用...')
        console.log('请求URL:', `${ALIYUN_API.endpoint}/${ALIYUN_API.appId}/completion`)
        console.log('图片URL:', event.image_url)

        const response = await request({
          url: `${ALIYUN_API.endpoint}/${ALIYUN_API.appId}/completion`,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ALIYUN_API.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: {
            input: {
              prompt: user_input || '分析图中的食物',
              biz_params: {
                image_url: event.image_url
              }
            },
            parameters: {}
          }
        })

        console.log('API调用成功！')
        console.log('响应数据:', JSON.stringify(response.data, null, 2))

        if (response.data.output && response.data.output.text) {
          return {
            code: 200,
            data: {
              res: response.data.output.text
            }
          }
        }

        throw new Error('Invalid API response')
      } catch (error) {
        console.error('API调用失败！')
        console.error('错误类型:', error.name)
        console.error('错误消息:', error.message)

        if (error.errMsg) {
          console.error('微信错误信息:', error.errMsg)
        }

        return {
          code: 500,
          data: {
            res: JSON.stringify({
              msg: "error",
              detail: error.errMsg || error.message
            })
          }
        }
      }

    case 'deleteImage':
      // 删除云存储中的图片
      try {
        await cloud.deleteFile({
          fileList: [fileID]
        })
        return {
          code: 200,
          message: '删除成功'
        }
      } catch (err) {
        console.error('删除图片失败:', err)
        return {
          code: 500,
          message: '删除图片失败'
        }
      }

    default:
      return {
        code: 404,
        message: '未知操作'
      }
  }
}
