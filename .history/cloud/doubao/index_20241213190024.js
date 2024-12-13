// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 原有的食物分析模型
const FOOD_MODEL_ID = 'ep-20231213184755-mnwwz'
// 新增的营养分析模型
const NUTRITION_MODEL_ID = 'ep-20241213184755-mnwwz'

// 豆包 API 配置
const DOUBAO_API = 'https://api.doubao.com/api/v1/text/generations'
const API_KEY = process.env.DOUBAO_API_KEY

// 原有的食物分析函数
async function analyzeFoodImage(imageUrl, prompt) {
  // ... 保持原有代码不变 ...
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

    const response = await axios.post(DOUBAO_API, {
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
      // 尝试解析返回的 JSON 字符串
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
