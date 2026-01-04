/** 用户个人资料 */
export interface Profile {
  /** 用户名（不可编辑） */
  userName: string;

  /** 手机号（不可编辑） */
  mobilePhone: string;

  /** 昵称 */
  nickName: string;

  /** 真实姓名（可选） */
  realName?: string;

  /** 性别：0-女，1-男 */
  gender: 0 | 1;

  /** 性别显示名称：'男' | '女' */
  genderName: string;

  /** 头像URL地址 */
  avatarUrl: string;

  /** 出生日期，格式 YYYY-MM-DD */
  birthDate: string;
}
