// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 豆包 API 配置
const DOUBAO_API = 'https://api.doubao.com/api/v1'
const API_KEY = process.env.DOUBAO_API_KEY // 从环境变量获取

// 食物识别模型
const FOOD_MODEL = 'ep-20231213184755-mnwwz'
// 营养分析模型
const NUTRITION_MODEL = 'ep-20241213184755-mnwwz'

// 营养分析系统提示词
const NUTRITION_PROMPT = `你是营养师，分析食材营养成分并以JSON格式输出。必须包含calories(kcal)、carbohydrates(g)、protein(g)、fat(g)四个字段，根据数量计算总量。

示例：
输入：{"food": "苹果", "count": 2, "unit": "个"}
输出：{"calories": 190, "carbohydrates": 50.2, "protein": 0.8, "fat": 0.4}`

exports.main = async (event) => {
  const { action = 'analyze', imageUrl, prompt, foodData } = event

  try {
    switch (action) {
      case 'analyze':
        // 原有的食物识别逻辑
        return await analyzeFood(imageUrl, prompt)

      case 'nutrition':
        // 新增的营养分析逻辑
        return await analyzeNutrition(foodData)

      default:
        return {
          code: 400,
          message: '未知的操作类型'
        }
    }
  } catch (err) {
    console.error('处理失败:', err)
    return {
      code: 500,
      message: err.message || '服务异常'
    }
  }
}

// 原有的食物识别函数
async function analyzeFood(imageUrl, prompt = '') {
  try {
    const response = await axios.post(`${DOUBAO_API}/text`, {
      model: FOOD_MODEL,
      messages: [
        {
          role: 'system',
          content: '你是一个食物识别助手，请识别图片中的食物，并以JSON格式返回food(食物名称)、count(数量)、unit(单位)三个字段。如果无法识别数量和单位，可以省略这两个字段。'
        },
        {
          role: 'user',
          content: [
            {
              type: 'image',
              url: imageUrl
            },
            {
              type: 'text',
              text: prompt || '这是什么食物？请告诉我名称、数量和单位。'
            }
          ]
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.output) {
      try {
        const result = JSON.parse(response.data.output)
        return {
          code: 200,
          data: result
        }
      } catch (err) {
        console.error('解析识别结果失败:', err)
        return {
          code: 500,
          message: '解析识别结果失败'
        }
      }
    }

    return {
      code: 500,
      message: '未获取到有效的识别结果'
    }
  } catch (err) {
    console.error('调用识别服务失败:', err)
    return {
      code: 500,
      message: '调用识别服务失败'
    }
  }
}

// 新增的营养分析函数
async function analyzeNutrition(foodData) {
  try {
    const response = await axios.post(`${DOUBAO_API}/text`, {
      model: NUTRITION_MODEL,
      messages: [
        {
          role: 'system',
          content: NUTRITION_PROMPT
        },
        {
          role: 'user',
          content: JSON.stringify(foodData)
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.output) {
      try {
        const result = JSON.parse(response.data.output)
        // 验证返回的数据是否包含所有必需字段
        const requiredFields = ['calories', 'carbohydrates', 'protein', 'fat']
        const hasAllFields = requiredFields.every(field =>
          typeof result[field] === 'number' ||
          typeof result[field] === 'string'
        )

        if (!hasAllFields) {
          throw new Error('返回数据缺少必需字段')
        }

        return {
          code: 200,
          data: result
        }
      } catch (err) {
        console.error('解析营养分析结果失败:', err)
        return {
          code: 500,
          message: '解析营养分析结果失败'
        }
      }
    }

    return {
      code: 500,
      message: '未获取到有效的营养分析结果'
    }
  } catch (err) {
    console.error('调用营养分析服务失败:', err)
    return {
      code: 500,
      message: '调用营养分析服务失败'
    }
  }
}

