import fs from 'node:fs'
import path from 'node:path'

function getFolder(path) {
  const components = []
  const files = fs.readdirSync(path)
  files.forEach((item) => {
    const stat = fs.lstatSync(`${path}/${item}`)
    if (stat.isDirectory() === true && item !== 'components') {
      components.push(`${path}/${item}`)
      components.push(...getFolder(`${path}/${item}`))
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
      message: '请输入文件名',
      validate: (v) => {
        if (!v || v.trim === '') {
          return '文件名不能为空'
        }
        else {
          return true
        }
      },
    },
  ],
  actions: (data) => {
    const relativePath = path.relative('src/pages', data.path)
    const actions = [
      {
        type: 'add',
        path: `${data.path}/{{dotCase name}}.vue`,
        templateFile: 'plop-templates/page/index.hbs',
        data: {
          componentName: `${relativePath} ${data.name}`,
        },
      },
    ]
    return actions
  },
}
