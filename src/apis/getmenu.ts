import httpRequest from "@/request/index";

// 获取菜单信息
export function apiGetmenu(){
  return httpRequest({
    url: "menus",
    method: "get",
  })
}
