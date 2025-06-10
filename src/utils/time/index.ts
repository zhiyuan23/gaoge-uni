import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

interface FormatTimeOptions {
  format?: string; // 时间格式，如 YYYY-MM-DD
  placeholder?: string; // 空值占位符，默认 ''
  relative?: boolean; // 是否相对时间显示
  locale?: 'zh-cn' | 'en'; // 语言，默认 zh-cn
  status?: 'scheduled' | 'in_progress' | 'completed' | 'canceled'; // 比赛状态
}

/**
 * 通用时间格式化函数，适配比赛业务需求
 */
export function formatTime(
  timestamp?: number | null,
  options: FormatTimeOptions = {},
): string {
  const {
    format = 'YYYY-MM-DD HH:mm',
    placeholder = '',
    relative = false,
    locale = 'zh-cn',
    status,
  } = options

  if (!timestamp) return placeholder

  const ts = timestamp < 1e12 ? timestamp * 1000 : timestamp
  const time = dayjs(ts).locale(locale)

  // 比赛状态展示定制
  if (status === 'scheduled') {
    return `开赛时间：${time.format(format)}`
  }
  else if (status === 'completed') {
    return `已结束：${time.format(format)}`
  }
  else if (status === 'in_progress') {
    return `比赛进行中`
  }
  else if (status === 'canceled') {
    return `比赛已取消`
  }

  // 相对时间
  if (relative) {
    return time.fromNow()
  }

  return time.format(format)
}
