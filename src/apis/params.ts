import httpRequest from "@/request/index";

// 获取菜单信息
export function apiGetparams() {
  return httpRequest({
    url: "categories",
    method: "get",
  });
}

// 获取菜单信息
export function apiGetparamsaddlist(id: number, sel: string) {
  return httpRequest({
    url: `categories/${id}/attributes`,
    method: "get",
    params: {
      sel: sel,
    },
  });
}



export function apiAddparams(id: number,data:object) {
  return httpRequest({
    url: `categories/${id}/attributes`,
    method: "post",
    data,
  });
}



export function apigeteditparams(id: number,attrId:number,data:object) {
  return httpRequest({
    url: `categories/${id}/attributes/${attrId}`,
    method: "put",
    data,
  });
}


export function apideleteeditparams(id: number,attrId:number) {
  return httpRequest({
    url: `categories/${id}/attributes/${attrId}`,
    method: "delete",
  });
}

export function apideadddms(id: number,attrId:number,data:object) {
  return httpRequest({
    url: `categories/${id}/attributes/${attrId}`,
    method: "put",
    data
  });
}

