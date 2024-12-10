// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event
  const wxContext = cloud.getWXContext()

  switch (action) {
    case 'login':
      return await handleLogin(event, wxContext)
    default:
      return {
        code: 400,
        message: '未知的操作类型'
      }
  }
}

// 处理登录逻辑
async function handleLogin(event, wxContext) {
  const db = cloud.database()
  const { OPENID, APPID } = wxContext

  try {
    // 查询用户是否存在
    const userRes = await db.collection('users').where({
      openid: OPENID
    }).get()

    let user = null

    if (userRes.data.length === 0) {
      // 新用户,创建用户记录
      const result = await db.collection('users').add({
        data: {
          openid: OPENID,
          appid: APPID,
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })

      user = {
        _id: result._id,
        openid: OPENID
      }
    } else {
      user = userRes.data[0]
    }

    return {
      code: 200,
      message: '登录成功',
      data: {
        user
      }
    }
  } catch (err) {
    console.error('[登录失败]', err)
    return {
      code: 500,
      message: '登录失败'
    }
  }
}
