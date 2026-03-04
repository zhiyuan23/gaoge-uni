export default {
  description: '创建 Pinia 全局状态模块',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入模块名称 (如: user)',
      validate: (v) => {
        if (!v || v.trim() === '') {
          return '模块名称不能为空'
        }
        return true
      },
    },
  ],
  actions: () => {
    return [
      {
        type: 'add',
        path: 'src/store/modules/{{camelCase name}}.ts',
        templateFile: 'plop-templates/store/index.hbs',
      },
    ]
  },
}
