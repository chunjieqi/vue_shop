import httpRequest from "@/request/index";
// 获取菜单信息
export function apiGetorderlist(params: object) {
  return httpRequest({
    url: "orders",
    method: "get",
    params,
  });
}


export function apiGetorderStatus(id:number,params: object) {
    return httpRequest({
      url: `/kuaidi/${id}`,
      method: "get",
      params,
    });
  }
  