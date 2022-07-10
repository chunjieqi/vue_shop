import httpRequest from "@/request/index";

// 获取菜单信息
export function apiGetcatlist(params:object){
  return httpRequest({
    url: "categories",
    method: "get",
    params,
  })
}

export function apiaddcat(data:object){
  return httpRequest({
    url: "categories",
    method: "post",
    data,
  })
}

export function apieditgetname(id:number){
  return httpRequest({
    url: `categories/${id}`,
    method: "get",
  })
}

export function apieditname(id:number,data:object){
  return httpRequest({
    url: `categories/${id}`,
    method: "put",
    data
  })
}


//删除请求
export function apieditdelete(id:number){
  return httpRequest({
    url: `categories/${id}`,
    method: "delete",
  })
}



