
// 用户接口
import request from '@/utils/request'

// 登录
export function login (user) {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: user })
}
