const cloud = require('wx-server-sdk')

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

        // 获取图片的临时访问链接
        const { fileList } = await cloud.getTempFileURL({
          fileList: [event.image_url.split('/zip')[0]]
        })
        const imageUrl = fileList[0].tempFileURL

        console.log('图片URL:', imageUrl)

        // 使用云调用访问阿里云API
        const result = await cloud.openapi.serviceMarket.invokeService({
          service: 'dashscope',
          api: 'apps.completion',
          data: {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${ALIYUN_API.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: {
              input: {
                prompt: user_input || '分析图中的食物',
                biz_params: {
                  image_url: imageUrl
                }
              },
              parameters: {}
            }
          }
        })

        console.log('API调用成功！')
        console.log('响应数据:', JSON.stringify(result, null, 2))

        if (result.data && result.data.output && result.data.output.text) {
          return {
            code: 200,
            data: {
              res: result.data.output.text
            }
          }
        }

        throw new Error('Invalid API response')
      } catch (error) {
        console.error('API调用失败！')
        console.error('错误信息:', error.message)
        console.error('错误详情:', error)

        return {
          code: 500,
          data: {
            res: JSON.stringify({
              msg: "error",
              detail: error.message
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
