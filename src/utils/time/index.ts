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
    format = 'YYYY-MM-DD',
    placeholder = '',
    relative = false,
    locale = 'zh-cn',
  } = options

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return placeholder
  }

  const ts = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp
  const time = dayjs(ts).locale(locale)

  if (relative) {
    return time.fromNow()
  }

  return time.format(format)
}
