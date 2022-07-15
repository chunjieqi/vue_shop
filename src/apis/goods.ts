import httpRequest from "@/request/index";

// 获取菜单信息
export function apiGetgoodslist(params:object){
  return httpRequest({
    url: "goods",
    method: "get",
    params
  })
}
//删除
// 获取菜单信息
export function apiDeletegoodslist(id:number){
  return httpRequest({
    url: `goods/${id}`,
    method: "delete",
  })
}


//添加
export function apiAddegoodslist(data:object){
  return httpRequest({
    url: 'goods',
    method: "post",
    data
  })
}
