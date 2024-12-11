const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const foodCollection = db.collection('food_records')

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, fileID, foodData, description } = event
  const { OPENID } = cloud.getWXContext()

  switch (action) {
    case 'uploadImage':
      // 获取图片临时链接并添加压缩样式
      try {
        const { fileList } = await cloud.getTempFileURL({
          fileList: [fileID]
        })
        const url = fileList[0].tempFileURL
        return {
          code: 200,
          data: {
            url: `${url}/zip`,  // 添加压缩样式
            fileID
          }
        }
      } catch (err) {
        console.error('获取图片链接失败:', err)
        return {
          code: 500,
          message: '获取图片链接失败'
        }
      }

    case 'deleteImage':
      // 删除云存储中的图片
      try {
        await cloud.deleteFile({
          fileList: [fileID]
        })
        return {
          code: 200,
          message: '删除成功'
        }
      } catch (err) {
        console.error('删除图片失败:', err)
        return {
          code: 500,
          message: '删除图片失败'
        }
      }

    case 'saveRecord':
      // 保存食物记录到数据库
      try {
        // 1. 获取永久图片链接
        const { fileList } = await cloud.getTempFileURL({
          fileList: [fileID]
        })
        const imageUrl = fileList[0].tempFileURL

        // 2. 构建记录数据
        const record = {
          userID: OPENID,
          fileID,
          imageUrl,
          description,
          food: foodData.food,
          count: foodData.count,
          unit: foodData.unit,
          nutrients: foodData.nutrients,
          createdAt: db.serverDate(),
          updatedAt: db.serverDate()
        }

        // 3. 保存到数据库
        const result = await foodCollection.add({
          data: record
        })

        return {
          code: 200,
          data: {
            _id: result._id
          },
          message: '保存成功'
        }
      } catch (err) {
        console.error('保存记录失败:', err)
        return {
          code: 500,
          message: '保存记录失败'
        }
      }

    case 'getRecords':
      // 获取用户的食物记录
      try {
        const { page = 1, pageSize = 10 } = event
        const skip = (page - 1) * pageSize

        const countResult = await foodCollection.where({
          userID: OPENID
        }).count()

        const { data } = await foodCollection
          .where({
            userID: OPENID
          })
          .orderBy('createdAt', 'desc')
          .skip(skip)
          .limit(pageSize)
          .get()

        return {
          code: 200,
          data: {
            list: data,
            total: countResult.total,
            page,
            pageSize
          }
        }
      } catch (err) {
        console.error('获取记录失败:', err)
        return {
    default:
      return {
        code: 404,
        message: '未知操作'
      }
  }
}
