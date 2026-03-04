/** @type {import('cz-git').CommitizenGitOptions} */
export default {
  // 快捷提交
  alias: {
    feat: 'feat: 🎸新增功能',
    fix: 'fix: 🐛修复问题',
    ref: 'refactor: 💡代码重构',
    style: 'style: 💄样式调整',
    docs: 'docs: ✏️文档更新',
  },

  // 交互提示
  messages: {
    type: '选择提交类型:',
    scope: '选择影响范围（可选）:',
    customScope: '请输入自定义范围:',
    subject: '填写本次提交的中文描述:',
    confirmCommit: '确认提交？',
  },

  // 提交类型
  types: [
    { value: 'feat', name: 'feat:     新增功能', emoji: '🎸' },
    { value: 'fix', name: 'fix:      修复问题', emoji: '🐛' },
    { value: 'refactor', name: 'refactor: 代码重构', emoji: '💡' },
    { value: 'chore', name: 'chore:    其他修改', emoji: '🤖' },
    { value: 'style', name: 'style:    样式调整', emoji: '💄' },
    { value: 'docs', name: 'docs:     文档更新', emoji: '✏️' },
    { value: 'perf', name: 'perf:     性能提升', emoji: '⚡️' },
    { value: 'ci', name: 'ci:       持续集成', emoji: '🎡' },
  ],

  useEmoji: true,
  useAI: false,

  skipQuestions: ['body', 'breaking', 'footer'],

  upperCaseSubject: false,

  minSubjectLength: 4,

  allowBreakingChanges: [],

  defaultSubject: '',
  defaultScope: '',
}
