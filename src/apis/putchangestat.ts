// 导入axios实例
import httpRequest from '@/request/index'

// 发送用户请求
export function apiPutUserState(id:number,ty:boolean) {
    return httpRequest({
		url: `users/${id}/state/${ty}`,
		method: 'put',
	})
}
