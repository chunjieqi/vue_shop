import httpRequest from "@/request/index";

// 获取菜单信息
export function apiGetparams() {
  return httpRequest({
    url: "reports/type/1",
    method: "get",
  });
}