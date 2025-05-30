
// 如何使用jql触发器请参考文档：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
module.exports = {
  trigger: {
	// 注册数据表的read前事件
    beforeRead: async function (
	// 确定要监听的什么样的JQL指令
	{
      collection,
      operation,
      where,
      field
    } = {}) {
		// 当上述jql指令被触发时，将执行这里的代码。这里就是普通的uniCloud代码，可以调用uniCloud的各种api。
		console.log("这个触发器被触发了")
    },
    afterRead: async function ({
      collection,
      operation,
      where,
      field
    } = {}) {

    }
  }
}
