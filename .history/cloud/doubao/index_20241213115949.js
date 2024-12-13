// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 配置常量
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
const API_KEY = process.env.DOUBAO_API_KEY // 从环境变量获取API Key

// 云函数入口函数
exports.main = async (event) => {
  const { imageUrl, prompt } = event

  try {
    // 1. 如果传入了图片URL,需要获取图片的base64编码
    let imageContent = null
    if (imageUrl) {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const base64Image = Buffer.from(response.data, 'binary').toString('base64')
      imageContent = `data:image/jpeg;base64,${base64Image}`
    }

    // 2. 构建请求体
    const requestBody = {
      model: process.env.DOUBAO_MODEL_ID, // 从环境变量获取模型ID
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt || '这张图片里有什么食物?请详细描述食物的种类、数量和营养成分。'
            }
          ]
        }
      ],
      stream: false,
      max_tokens: 1000
    }

    // 如果有图片,添加到content中
    if (imageContent) {
      requestBody.messages[0].content.push({
        type: 'image_url',
        image_url: {
          url: imageContent,
          detail: 'high' // 使用高清模式以获取更好的识别效果
        }
      })
    }

    // 3. 调用API
    const result = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      data: requestBody
    })

    // 4. 处理响应
    if (result.data.choices && result.data.choices.length > 0) {
      return {
        code: 200,
        data: {
          content: result.data.choices[0].message.content,
          usage: result.data.usage
        }
      }
    }

    return {
      code: 500,
      message: '未获取到有效响应'
    }

  } catch (error) {
    console.error('调用大模型API失败:', error)
    return {
      code: 500,
      message: error.message || '调用失败',
      error: error.response?.data || error
    }
  }
}
