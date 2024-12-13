// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 配置常量
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
const API_KEY = '89849086-a530-4f0b-9425-a9d0fdcd54dc' // 直接使用API Key而不是从环境变量获取

// 系统提示词
const SYSTEM_PROMPT = `你是专业食物分析AI助手。识别图片中食物。

{
  "food": "食物名称",
  "count": 数量,
  "unit": "单位"
}

规则：
- count为整数
- 只输出JSON`

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
      model: 'ep-20241213102609-w2qqm', // 直接使用模型ID
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt || '请分析这张图片中的食物及其营养成分。'
            }
          ]
        }
      ],
      stream: false,
      max_tokens: 1000,
      temperature: 0.1 // 降低随机性,使输出更加稳定
    }

    // 如果有图片,添加到content中
    if (imageContent) {
      requestBody.messages[1].content.push({
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
      try {
        // 尝试解析返回的JSON字符串
        const content = JSON.parse(result.data.choices[0].message.content)
        return {
          code: 200,
          data: content
        }
      } catch (parseError) {
        return {
          code: 400,
          message: '返回格式错误',
          error: parseError.message
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
      error: error.response?.data || error,
      requestId: error.response?.headers?.['x-request-id']
    }
  }
}