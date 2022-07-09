<template>
   <div class="Rights">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
         <el-breadcrumb-item :to="{ path: '/home' }">后台管理系统</el-breadcrumb-item>
         <el-breadcrumb-item>权限管理</el-breadcrumb-item>
         <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 面包屑完  -->
      <!-- 卡片视图 -->
      <el-card>
         <!-- table表格 -->
         <el-table :data="full" stripe border style="width: 100%">
            <el-table-column type="index" label="#" />
            <el-table-column prop="authName" label="权限名称" />
            <el-table-column prop="path" label="路径" />
            <el-table-column prop="level" label="权限等级">
               <template v-slot="scope">
                  <el-tag v-if="scope.row.level === '1'">一级</el-tag>
                  <el-tag v-else-if="scope.row.level === '2'" type="success">二级</el-tag>
                  <el-tag v-else type="warning">三级</el-tag>
               </template>
            </el-table-column>
         </el-table>
         <!-- 分页器 -->
         <el-pagination v-model:current-page="nowpage" background layout="prev, pager, next" :total="50" />
         <!-- table表格完 -->
      </el-card>
      <!-- 卡片视图完 -->
   </div>
</template>

<script setup>
import { defineComponent, reactive, toRefs, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiGetrightlist } from '@/apis/rights'
//定义变量储存列表数据
let tablelist = ref([])
let currentpage = ref(0)
//封装获取列表函数

const data = ref([]) // 页面渲染的数据
const pageSize = 10 // 每页数据条数
let nowpage = ref(1)    //现在的页数
// // 分页方法(用计算属性把分页器的数据和表单的数据绑定在一起，里用计算属性的特点实现一个变化会实时刷新另一个数据)
const full = computed({
   get() {
      return tablelist.value.slice((nowpage.value - 1) * pageSize, nowpage.value * pageSize)
   },
})

function getauthlist() {
   apiGetrightlist().then(res => {
      // console.log(res.data);
      tablelist.value = res.data
   }).catch(err => {
      ElMessage({
         type: 'error',
         message: '网络异常，获取列表失败',
      })
   })
}
//在页面一开始就发送请求获取列表
getauthlist()
//

</script>
<style scoped>
.el-table {
   font-size: 12px;
}
</style>