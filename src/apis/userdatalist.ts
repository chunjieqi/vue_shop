// 导入axios实例
import httpRequest from "@/request/index";

// 定义接口的传参
interface UserInfoParam {
  query: string;
  pagenum: number;
  pagesize: number;
}
// 发送用户请求
export function apiGetUserlistdata(params: UserInfoParam) {
  return httpRequest({
    url: "users",
    method: "get",
    params,
  });
}
//添加用户
export function apiAdduserInfo(data: object) {
  return httpRequest({
    url: "users",
    method: "post",
    data,
  });
}

export function apiGetbianji(id: number) {
  return httpRequest({
    url: `users/${id}`,
    method: "get",
  });
}
export function apiEdituserInfo(id: number, data: object) {
  return httpRequest({
    url: `users/${id}`,
    method: "put",
    data,
  });
}

//删除
export function apiDeleteuser(id: number) {
  return httpRequest({
    url: `users/${id}`,
    method: "delete",
  });
}
