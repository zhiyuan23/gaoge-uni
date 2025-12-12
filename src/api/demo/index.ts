/**
 * 用户信息相关接口
 */
import type { CommonRes } from '@/api/common/types'

import { post } from '@/api'

/** 退出登录 */
export const logout = () => post<CommonRes>('/user/logout')
