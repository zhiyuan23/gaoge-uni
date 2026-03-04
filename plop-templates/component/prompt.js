import fs from 'node:fs'
import path from 'node:path'

function getFolder(dirPath) {
  const components = []
  if (!fs.existsSync(dirPath)) return components

  const files = fs.readdirSync(dirPath)
  files.forEach((item) => {
    const fullPath = path.join(dirPath, item)
    const stat = fs.lstatSync(fullPath)
    // 过滤掉 node_modules
    if (stat.isDirectory() && item !== 'node_modules') {
      components.push(fullPath)
      components.push(...getFolder(fullPath))
    }
  })
  return components
}

export default {
  description: '创建组件',
  prompts: [
    {
      type: 'confirm',
      name: 'isGlobal',
      message: '是否为全局组件？(存放在 src/components)',
      default: true,
    },
    {
      type: 'list',
      name: 'path',
      message: '请选择存放目录',
      choices: getFolder('src/pages'),
      when: answers => !answers.isGlobal,
    },
    {
      type: 'input',
      name: 'name',
      message: '请输入组件文件名 (如: MyInput)',
      validate: (v) => {
        if (!v || v.trim() === '') {
          return '组件名称不能为空'
        }
        return true
      },
    },
  ],
  actions: (data) => {
    let targetPath = ''

    // 基础路径确定
    const basePath = data.isGlobal ? 'src/components' : data.path

    if (data.useFolder) {
      // 文件夹模式: path/MyComponent/index.vue
      targetPath = `${basePath}/{{properCase name}}/index.vue`
    }
    else {
      // 单文件模式: path/MyComponent.vue (按照你要求的直接创建文件名Vue)
      targetPath = `${basePath}/{{properCase name}}.vue`
    }

    return [
      {
        type: 'add',
        path: targetPath,
        templateFile: 'plop-templates/component/index.hbs',
      },
    ]
  },
}
