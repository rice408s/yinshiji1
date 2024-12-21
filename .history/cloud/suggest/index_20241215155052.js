const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// API 配置
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
const API_KEY = '89849086-a530-4f0b-9425-a9d0fdcd54dc'
const MODEL_ID = 'ep-20241215152620-8dxv7'

// 系统提示词
const SYSTEM_PROMPT = `你是一位专业的营养师，擅长分析每日饮食数据并给出简短建议。你的建议应该简洁明了，针对性强，且易于执行。每条建议不超过30字。`

async function analyzeDietAndSuggest(records) {
  try {
    // 准备用户饮食数据
    const dietData = records.map(record => ({
      food: record.food,
      count: record.count,
      unit: record.unit,
      nutrients: record.nutrients,
      time: record.time
    }))

    const userPrompt = `基于以下饮食记录，给出改善建议：${JSON.stringify(dietData)}`

    const response = await axios.post(API_URL, {
      model: MODEL_ID,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const suggestion = response.data.choices[0].message.content.trim()

    return {
      code: 200,
      data: {
        suggestion
      }
    }
  } catch (err) {
    console.error('生成建议失败:', err)
    return {
      code: 500,
      message: err.message || '生成建议失败'
    }
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { records } = event

  if (!records || !Array.isArray(records)) {
    return {
      code: 400,
      message: '请提供有效的饮食记录'
    }
  }

  return await analyzeDietAndSuggest(records)
}
