const db = uniCloud.database()
const collection = db.collection('team_assets')

module.exports = {
  // 获取资产列表
  async getList(params) {
    // 基础查询（可根据 params 扩展条件）
    let query = collection

    // 示例：按类型过滤
    if (params.type) {
      query = query.where({ type: params.type })
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

  // 获取单个资产详情
  async getDetail(id) {
    const query = collection
    const { data } = await query.doc(id).get()
    return data ? { code: 200, data } : { code: 404, message: '资产不存在' }
  },
}
