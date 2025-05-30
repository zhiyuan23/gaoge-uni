/* eslint-disable no-undef */
module.exports = {
  // 获取球员列表
  async getList(params) {
    const db = uniCloud.database()
    const collection = db.collection('players')

    // 基础查询（可根据 params 扩展条件）
    let query = collection

    // 示例：按类型过滤
    if (params.team) {
      query = query.where({ team: params.team })
    }

    // 示例：分页
    const { page = 1, pageSize = 10 } = params
    const { data: list } = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('created_at', 'desc')
      .get()

    // 获取总数（用于分页）
    const { total } = await query.count()

    return {
      code: 200,
      data: {
        list,
        total,
      },
    }
  },

  // 获取球员详情
  async getDetail() {

  },
}
