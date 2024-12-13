// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// API 配置
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
const API_KEY = '89849086-a530-4f0b-9425-a9d0fdcd54dc'
const DOUBAO_API = 'https://api.doubao.com/api/v1/text/generations'

// 模型配置
const FOOD_MODEL_ID = 'ep-20241213102609-w2qqm'
const NUTRITION_MODEL_ID = 'ep-20241213184755-mnwwz'

// 系统提示词
const SYSTEM_PROMPT = `你是专业食物分析AI助手。识别图片中食物。

严格按照以下JSON格式输出，不要添加任何其他描述：
{
  "food": "食物名称",
  "count": 数量,
  "unit": "单位"
}

规则：
- count必须为整数
- 只输出JSON格式，不要添加任何额外描述或说明
- 不要输出换行符和空格`

// 原有的食物分析函数
async function analyzeFoodImage(imageUrl, prompt) {
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
      model: FOOD_MODEL_ID,
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
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : rawContent;

        const content = JSON.parse(jsonStr);
        console.log('解析后的JSON:', content);

        return {
          code: 200,
          data: content,
          raw: rawContent // 保留原始内容用于调试
        }
      } catch (parseError) {
        console.error('JSON解析失败:', parseError)
        return {
          code: 400,
          message: '返回格式错误',
          error: parseError.message,
          raw: rawContent
        }
      }
    }

    return {
      code: 500,
      message: '未获取到有效响应',
      raw: result.data
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

// 新增的营养分析函数
async function analyzeNutrition(foodData) {
  try {
    const { food, count = 1, unit = '份' } = foodData

    const systemPrompt = `你是营养师，分析食材营养成分并以JSON格式输出。必须包含calories(kcal)、carbohydrates(g)、protein(g)、fat(g)四个字段，根据数量计算总量。

示例：
输入：{"food": "苹果", "count": 2, "unit": "个"}
输出：{"calories": 190, "carbohydrates": 50.2, "protein": 0.8, "fat": 0.4}`

    const userPrompt = JSON.stringify({ food, count, unit })

    const response = await axios.post(API_URL, {
      model: NUTRITION_MODEL_ID,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      top_p: 0.8,
      max_tokens: 800
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const content = response.data.choices[0].message.content
    try {
      const nutritionData = JSON.parse(content)
      return {
        code: 200,
        data: nutritionData
      }
    } catch (err) {
      console.error('营养数据解析失败:', content)
      return {
        code: 500,
        message: '营养数据格式错误'
      }
    }
  } catch (err) {
    console.error('营养分析失败:', err)
    return {
      code: 500,
      message: err.message || '营养分析服务异常'
    }
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { action = 'analyze', imageUrl, prompt, foodData } = event

  switch (action) {
    case 'analyze':
      return await analyzeFoodImage(imageUrl, prompt)

    case 'nutrition':
      return await analyzeNutrition(foodData)

    default:
      return {
        code: 400,
        message: '未知的操作类型'
      }
  }
}
