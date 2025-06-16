const db = uniCloud.database()
const collection = db.collection('players')

module.exports = {
  // 获取球员列表
  async getList(params) {
    let query = collection

    if (params.team) {
      query = query.where({ team: params.team })
    }

    const { page = 1, pageSize = 10 } = params
    const { data: list } = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('number', 'asc')
      .get()

    const { total } = await query.count()

    return {
      code: 200,
      data: {
        list,
        total,
      },
    }
  },

  // 获取球员详情（动态字段查询）
  async getDetail(params) {
    if (!params || Object.keys(params).length === 0) {
      return { code: 400, message: '缺少查询参数' }
    }

    const query = {}

    for (const key in params) {
      const value = params[key]
      if (value !== undefined && value !== null && value !== '') {
        query[key] = value
      }
    }

    const res = await collection.where(query).get()

    // 处理查询结果
    // if (res.data.length === 0) {
    //   return { code: 404, message: '未找到球员信息' }
    // }

    return {
      code: 200,
      message: '查询成功',
      data: res.data[0] || null,
    }
  },

  // 获取未绑定 openid 的号码列表
  async getPlayerNumbers() {
    const res = await collection
      .where({
        openid: ''
      })
      .orderBy('number', 'asc')
      .get()

    const numbers = JSON.parse(JSON.stringify(res.data))
      .map(item => item.number)

    return {
      code: 200,
      message: '查询成功',
      data: numbers,
    }
  },

  // 绑定 openid 到指定号码的球员信息
  async bindPlayerOpenid({ number, openid }) {
    if (!openid) {
      return { code: 401, message: '未登录，缺少 openid' }
    }
    if (typeof number !== 'number') {
      return { code: 400, message: '无效的球员号码' }
    }

    const { data } = await collection.where({ number }).get()
    if (data.length === 0) {
      return { code: 404, message: '球员不存在' }
    }

    // 绑定 openid
    await collection.where({ number }).update({ openid })

    return { code: 200, message: '绑定成功' }
  },

  // 解除绑定 openid 到指定号码的球员信息
  async unbindPlayerOpenid({ number }) {
    if (!number) {
      return { code: 401, message: '未登录，缺少 number' }
    }
    // 解除绑定 openid
    await collection.where({ number }).update({ openid: '' })

    return { code: 200, message: '解除绑定成功' }
  },

  // 根据 openid 修改球员信息
  async updatePlayerInfo(params) {
    const { openid, number, ...updateFields } = params

    if (!openid || !number) {
      return { code: 400, message: '缺少 openid' }
    }

    if (Object.keys(updateFields).length === 0) {
      return { code: 400, message: '缺少要更新的字段' }
    }
    if (updateFields.code) {
      updateFields.code = updateFields.code.toUpperCase()
    }
    const res = await collection.where({ openid }).update(updateFields)

    return {
      code: 200,
      message: '更新成功',
    }
  }
}
