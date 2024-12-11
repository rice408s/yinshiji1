const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 阿里云 API 配置
const ALIYUN_API = {
  endpoint: 'https://dashscope.aliyuncs.com/api/v1/apps',
  appId: '17adecaaf25041cabb3bf7564c5b7196',
  apiKey: 'sk-259a2ec00e1f4c52967676ad51fdbf45'
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

        // 使用 request-promise 发起请求
        const options = {
          method: 'POST',
          url: `${ALIYUN_API.endpoint}/${ALIYUN_API.appId}/completion`,
          headers: {
            'Authorization': `Bearer ${ALIYUN_API.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: {
            input: {
              prompt: user_input || '分析图中的食物',
              biz_params: {
                'user_input': user_input,
                'image_url': event.image_url
              }
            },
            parameters: {}
          },
          json: true // 自动解析 JSON 响应
        }

        console.log('请求参数:', JSON.stringify(options, null, 2))

        const result = await rp(options)
        console.log('API响应:', JSON.stringify(result, null, 2))

        if (result.output && result.output.text) {
          return {
            code: 200,
            data: {
              res: result.output.text
            }
          }
        }

        throw new Error('Invalid API response')
      } catch (err) {
        console.error('调用阿里云API失败:', err)
        return {
          code: 500,
          data: {
            res: JSON.stringify({
              msg: "error",
              detail: err.message
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

    case 'testApi':
      try {
        console.log('开始测试API调用...')

        // 使用简单的 JSONPlaceholder API
        const options = {
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          json: true
        }

        console.log('请求参数:', options)

        const result = await rp(options)
        console.log('API响应:', result)

        return {
          code: 200,
          data: result
        }
      } catch (err) {
        console.error('API调用失败:', err)
        return {
          code: 500,
          message: err.message
        }
      }

    default:
      return {
        code: 404,
        message: '未知操作'
      }
  }
}
