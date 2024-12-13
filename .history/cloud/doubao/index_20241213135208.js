// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 配置常量
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
const API_KEY = '89849086-a530-4f0b-9425-a9d0fdcd54dc'

// 系统提示词
const SYSTEM_PROMPT = `你是专业食物分析AI助手。识别图片中食物。
输出shi
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
  console.log('接收到的参数:', { imageUrl, prompt })

  try {
    let imageContent = null
    if (imageUrl) {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const base64Image = Buffer.from(response.data, 'binary').toString('base64')
      imageContent = `data:image/jpeg;base64,${base64Image}`
      console.log('图片转换完成，长度:', base64Image.length)
    }

    const requestBody = {
      model: 'ep-20241213102609-w2qqm',
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
      temperature: 0.1
    }

    if (imageContent) {
      requestBody.messages[1].content.push({
        type: 'image_url',
        image_url: {
          url: imageContent,
          detail: 'high'
        }
      })
    }

    console.log('发送请求体:', JSON.stringify(requestBody, null, 2))

    const result = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      data: requestBody
    })

    console.log('API响应:', JSON.stringify(result.data, null, 2))

    if (result.data.choices && result.data.choices.length > 0) {
      const rawContent = result.data.choices[0].message.content
      console.log('AI返回的原始内容:', rawContent)

      try {
        const content = JSON.parse(rawContent)
        console.log('解析后的JSON:', content)
        return {
          code: 200,
          data: content,
          raw: rawContent // 添加原始返回内容用于调试
        }
      } catch (parseError) {
        console.error('JSON解析失败:', parseError)
        return {
          code: 400,
          message: '返回格式错误',
          error: parseError.message,
          raw: rawContent // 添加原始返回内容用于调试
        }
      }
    }

    return {
      code: 500,
      message: '未获取到有效响应',
      raw: result.data // 添加完整响应用于调试
    }

  } catch (error) {
    console.error('调用大模型API失败:', error)
    console.error('错误详情:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    })

    return {
      code: 500,
      message: error.message || '调用失败',
      error: error.response?.data || error,
      requestId: error.response?.headers?.['x-request-id'],
      status: error.response?.status
    }
  }
}
