// 导入axios实例
import httpRequest from '@/request/index'


// 发送用户请求
export function apiGetUserInfo(username:string,password:string) {
    return httpRequest({
		url: 'login',
		method: 'post',
		data: {
			username,      // 参数 firstName
    	    password   // 参数 lastName
		}
	})
}


