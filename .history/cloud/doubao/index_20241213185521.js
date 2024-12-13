// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 豆包API配置
const DOUBAO_API = 'https://api.doubao.com/api/v1/text/completions'
const MODEL_ID = 'ep-20241213184755-mnwwz'
const API_KEY = process.env.DOUBAO_API_KEY // 从环境变量获取

// 系统提示词
const SYSTEM_PROMPT = `你是营养师，分析食材营养成分并以JSON格式输出。必须包含calories(kcal)、carbohydrates(g)、protein(g)、fat(g)四个字段，根据数量计算总量。

示例：
输入：{"food": "苹果", "count": 2, "unit": "个"}
输出：{"calories": 190, "carbohydrates": 50.2, "protein": 0.8, "fat": 0.4}`

exports.main = async (event, context) => {
  const { imageUrl, prompt } = event

  try {
    // 构建请求体
    const requestBody = {
      model: MODEL_ID,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: JSON.stringify({
            food: prompt?.food || '未知食物',
            count: prompt?.count || 1,
            unit: prompt?.unit || '份'
          })
        }
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 800
    }

    // 调用豆包API
    const response = await axios.post(DOUBAO_API, requestBody, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    // 解析返回结果
    if (response.data && response.data.choices && response.data.choices[0]) {
      try {
        const nutritionData = JSON.parse(response.data.choices[0].message.content)

        // 验证必要字段
        const requiredFields = ['calories', 'carbohydrates', 'protein', 'fat']
        const hasAllFields = requiredFields.every(field =>
          typeof nutritionData[field] === 'number' && !isNaN(nutritionData[field])
        )

        if (!hasAllFields) {
          throw new Error('营养数据格式不完整')
        }

        return {
          code: 200,
          data: {
            ...prompt,  // 保留原始食物信息
            nutrients: nutritionData  // 添加营养信息
          }
        }
      } catch (parseError) {
        console.error('解析营养数据失败:', parseError)
        return {
          code: 400,
          message: '营养数据格式错误'
        }
      }
    }

    throw new Error('API返回数据格式错误')

  } catch (error) {
    console.error('调用豆包API失败:', error)
    return {
      code: 500,
      message: error.message || '营养分析失败'
    }
  }
}
