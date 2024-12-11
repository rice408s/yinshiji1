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

        // 使用固定的��试图片URL
        const testImageUrl = 'https://636c-cloud1-6gei04vq0fba7479-1330371510.tcb.qcloud.la/food/1733898458060-zqf8xw.jpg/zip'
        console.log('使用测试图片URL:', testImageUrl)

        const options = {
          method: 'POST',
          url: `${ALIYUN_API.endpoint}/${ALIYUN_API.appId}/completion`,
          headers: {
            'Authorization': `Bearer ${ALIYUN_API.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: {
            input: {
              prompt: user_input || '分析图中的食物',
              biz_params: {
                'user_input': user_input,
                'image_url': testImageUrl
              }
            },
            parameters: {}
          },
          json: true,
          timeout: 15000,  // 减少请求超时时间到15秒
          resolveWithFullResponse: true
        }

        console.log('请求参数:', JSON.stringify(options, null, 2))

        // 添加超时处理
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        })

        const response = await Promise.race([
          rp(options),
          timeoutPromise
        ])

        console.log('API响应状态码:', response.statusCode)
        console.log('API响应体:', JSON.stringify(response.body, null, 2))

        if (response.statusCode === 200 && response.body.output && response.body.output.text) {
          return {
            code: 200,
            data: {
              res: response.body.output.text
            }
          }
        }

        throw new Error(`API返回状态码: ${response.statusCode}`)
      } catch (err) {
        console.error('调用阿里云API失败:', err)

        if (err.message === 'Request timeout') {
          return {
            code: 500,
            data: {
              res: JSON.stringify({
                msg: "error",
                detail: "请求超时，请重试"
              })
            }
          }
        }

        return {
          code: 500,
          data: {
            res: JSON.stringify({
              msg: "error",
              detail: err.message || '未知错误'
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
