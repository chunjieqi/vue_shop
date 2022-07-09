// 导入axios实例
import httpRequest from "@/request/index";
import { reactive } from "vue";

// 发送用户请求
export function apiGetroluslist() {
  return httpRequest({
    url: "roles",
    method: "get",
  });
}

export function apiAddrolus(data: object) {
  return httpRequest({
    url: "roles",
    method: "post",
    data,
  });
}

export function apiEditrolus(id: number, data: object) {
  return httpRequest({
    url: `roles/${id}`,
    method: "put",
    data,
  });
}

export function apiGetrolusid(id: number) {
  return httpRequest({
    url: `roles/${id}`,
    method: "get",
  });
}

export function apiDeleterolus(id: number) {
  return httpRequest({
    url: `roles/${id}`,
    method: "delete",
  });
}

export function apiDeleterolustag(roleId: number, rightId: number) {
  return httpRequest({
    url: `roles/${roleId}/rights/${rightId}`,
    method: "delete",
  });
}

//获得所有权限信息

export function apigetrolusall() {
  return httpRequest({
    url: "rights/tree",
    method: "get",
  });
}

export function apifenpeirolus(id: number, rids: any) {
  return httpRequest({
    url: `roles/${id}/rights`,
    method: "post",
    data: rids,
  });
}
