// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event
  const wxContext = cloud.getWXContext()

  console.log('云函数调用:', { action, event, context })

  switch (action) {
    case 'login':
      return await handleLogin(event, wxContext)
    case 'checkLogin':
      return await checkLogin(wxContext)
    default:
      return {
        code: 400,
        message: '未知的操作类型'
      }
  }
}

// 检查登录状态
async function checkLogin(wxContext) {
  const db = cloud.database()
  const { OPENID } = wxContext

  try {
    if (!OPENID) {
      throw new Error('获取用户openid失败')
    }

    const user = await db.collection('users')
      .where({ openid: OPENID })
      .field({ password: 0 })
      .get()
      .then(res => res.data[0])

    if (!user) {
      return {
        code: 401,
        message: '用户未登录'
      }
    }

    return {
      code: 200,
      message: '已登录',
      data: { user }
    }
  } catch (err) {
    console.error('[检查登录状态失败]', err)
    return {
      code: 500,
      message: err.message || '检查登录状态失败'
    }
  }
}

// 处理登录逻辑
async function handleLogin(event, wxContext) {
  const db = cloud.database()
  const { OPENID, APPID } = wxContext
  const { userInfo } = event

  console.log('处理登录:', { OPENID, APPID, userInfo })

  try {
    if (!OPENID) {
      throw new Error('获取用户openid失败')
    }

    if (!userInfo) {
      throw new Error('获取用户信息失败')
    }

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
          ...userInfo,
          createTime: db.serverDate(),
          updateTime: db.serverDate(),
          lastLoginTime: db.serverDate()
        }
      })

      user = {
        _id: result._id,
        openid: OPENID,
        ...userInfo
      }

      console.log('创建新用户:', user)
    } else {
      // 更新已有用户
      user = userRes.data[0]
      await db.collection('users').doc(user._id).update({
        data: {
          ...userInfo,
          lastLoginTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })

      console.log('更新已有用户:', user)
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
      message: err.message || '登录失败'
    }
  }
}
