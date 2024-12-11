const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 阿里云 API 配置
const ALIYUN_API = {
  endpoint: 'https://dashscope.aliyuncs.com/api/v1/apps',
  appId: '17adecaaf25041cabb3bf7564c5b7196',  // 替换为你的应用ID
  apiKey: 'sk-259a2ec00e1f4c52967676ad51fdbf45'  // 替换为你的API Key
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

        const response = await axios({
          method: 'POST',
          url: `${ALIYUN_API.endpoint}/${ALIYUN_API.appId}/completion`,
          headers: {
            'Authorization': `Bearer ${ALIYUN_API.apiKey}`,
            'Content-Type': 'application/json'
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
        console.log('响应状态:', response.status)
        console.log('响应头:', response.headers)
        console.log('响应数据:', JSON.stringify(response.data, null, 2))

        // 直接返回API的响应文本
        if (response.data.output && response.data.output.text) {
          return {
            code: 200,
            data: {
              res: response.data.output.text
            }
          }
        } else {
          throw new Error('Invalid API response')
        }
      } catch (err) {
        console.error('调用阿里云API失败:', err)
        console.error('错误详情:', err.response?.data || err.message)  // 添加更详细的错误信息
        return {
          code: 500,
          data: {
            res: '{"msg": "error"}'
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
