// 导入axios实例
import httpRequest from "@/request/index";

// 发送用户请求
export function apiGetrightlist() {
  return httpRequest({
    url: "rights/list",
    method: "get",
  });
}
