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
    case 'logout':
      return await handleLogout(wxContext)
    case 'updateUserInfo':
      return await handleUpdateUserInfo(event, wxContext)
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

  console.log('云函数 checkLogin - 开始检查:', { OPENID })

  try {
    const user = await db.collection('users')
      .where({ openid: OPENID })
      .get()
      .then(res => res.data[0])

    console.log('云函数 checkLogin - 查询结果:', user)

    if (!user) {
      console.log('云函数 checkLogin - 用户不存在')
      return {
        code: 401,
        message: '用户未登录'
      }
    }

    // 更新最后活跃时间
    await db.collection('users').doc(user._id).update({
      data: {
        lastActiveTime: db.serverDate()
      }
    })

    console.log('云函数 checkLogin - 更新活跃时间成功')

    return {
      code: 200,
      message: '已登录',
      data: { user }
    }
  } catch (err) {
    console.error('云函数 checkLogin - 错误:', err)
    return {
      code: 500,
      message: '检查登录状态失败'
    }
  }
}

// 处理登录逻辑
async function handleLogin(event, wxContext) {
  const db = cloud.database()
  const { OPENID } = wxContext
  const { userInfo } = event

  console.log('处理登录:', { OPENID, userInfo })

  try {
    if (!userInfo || !userInfo.avatarUrl || !userInfo.nickName) {
      throw new Error('用户信息不完整')
    }

    // 查询用户是否存在
    const userRes = await db.collection('users')
      .where({ openid: OPENID })
      .get()

    let user = null

    if (userRes.data.length === 0) {
      // 新用户,创建用户记录
      const result = await db.collection('users').add({
        data: {
          openid: OPENID,
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })

      user = {
        _id: result._id,
        openid: OPENID,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      }
    } else {
      user = userRes.data[0]
      // 更新用户信息
      await db.collection('users').doc(user._id).update({
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          updateTime: db.serverDate()
        }
      })
    }

    return {
      code: 200,
      message: '登录成功',
      data: { user }
    }
  } catch (err) {
    console.error('[登录失败]', err)
    return {
      code: 500,
      message: err.message || '登录失败'
    }
  }
}

// 处理退出登录
async function handleLogout(wxContext) {
  const db = cloud.database()
  const { OPENID } = wxContext

  try {
    // 更新用户的登录状态
    await db.collection('users')
      .where({ openid: OPENID })
      .update({
        data: {
          lastLogoutTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })

    return {
      code: 200,
      message: '退出成功'
    }
  } catch (err) {
    console.error('[退出失败]', err)
    return {
      code: 500,
      message: '退出失败'
    }
  }
}

// 处理更新用户信息
async function handleUpdateUserInfo(event, wxContext) {
  const db = cloud.database()
  const { OPENID } = wxContext
  const { userInfo } = event

  try {
    if (!userInfo || !userInfo.avatarUrl || !userInfo.nickName) {
      throw new Error('用户信息不完整')
    }

    // 更新用户信息
    await db.collection('users')
      .where({ openid: OPENID })
      .update({
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          updateTime: db.serverDate()
        }
      })

    // 获取更新后的用户信息
    const user = await db.collection('users')
      .where({ openid: OPENID })
      .get()
      .then(res => res.data[0])

    return {
      code: 200,
      message: '更新成功',
      data: { user }
    }
  } catch (err) {
    console.error('[更新用户信息失败]', err)
    return {
      code: 500,
      message: err.message || '更新用户信息失败'
    }
  }
}
