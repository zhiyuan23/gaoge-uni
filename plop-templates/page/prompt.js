import fs from 'node:fs'
import path from 'node:path'

function getFolder(dirPath) {
  const components = []
  // 确保目录存在
  if (!fs.existsSync(dirPath)) return components

  const files = fs.readdirSync(dirPath)
  files.forEach((item) => {
    const fullPath = path.join(dirPath, item)
    const stat = fs.lstatSync(fullPath)
    if (stat.isDirectory() && item !== 'components') {
      components.push(fullPath)
      components.push(...getFolder(fullPath))
    }
  })
  return components
}

export default {
  description: '创建页面',
  prompts: [
    {
      type: 'list',
      name: 'path',
      message: '请选择页面创建目录',
      choices: getFolder('src/pages'),
    },
    {
      type: 'input',
      name: 'name',
      message: '请输入组件/文件名 (kebab-case)',
      validate: (v) => {
        if (!v || v.trim() === '') {
          return '文件名不能为空'
        }
        return true
      },
    },
  ],
  actions: (data) => {
    const relativePath = path.relative('src/pages', data.path)

    // 自动在所选目录下创建一个以 name 命名的文件夹，并生成 index.vue
    // 这种结构在 uniapp 中更有利于组织 components 文件夹
    return [
      {
        type: 'add',
        path: `${data.path}/{{kebabCase name}}/index.vue`,
        templateFile: 'plop-templates/page/index.hbs',
        data: {
          componentName: `${relativePath} ${data.name}`,
        },
      },
    ]
  },
}
