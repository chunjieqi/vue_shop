<template>
   <div class="Goods">
      <!-- 面包屑 -->
      <el-breadcrumb separator="/">
         <el-breadcrumb-item :to="{ path: '/home' }">后台管理系统</el-breadcrumb-item>
         <el-breadcrumb-item>商品管理</el-breadcrumb-item>
         <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 面包屑完 -->
      <!-- 卡片  -->
      <el-card>
         <el-row :gutter="20">
            <el-col :span="6">
               <!-- 搜索框 -->
               <el-input clearable @clear="getdatalist" v-model="pagedata.query" placeholder="请输入内容">
                  <template #append>
                     <!-- 搜索按钮 -->
                     <el-button @click="getdatalist">
                        <el-icon>
                           <Search />
                        </el-icon>
                     </el-button>
                  </template>
               </el-input>
            </el-col>
            <el-col :span="4">
               <el-button @click="addGoods" type="primary">添加商品</el-button>
            </el-col>
         </el-row>
         <!-- table表格 -->
         <el-table :data="tableData" border stripe class="eltableda" style="width: 100%">
            <el-table-column type="index" label="#" width="50px" />
            <el-table-column prop="goods_name" label="商品名称" />
            <el-table-column prop="goods_price" label="价格" width="95px" />
            <el-table-column prop="goods_weight" label="商品重量" width="70px" />
            <el-table-column prop="add_time" label="添加时间" width="180px">
               <template #default="scope">
                  {{ daytotime(scope.row.add_time) }}
               </template>
            </el-table-column>
            <el-table-column label="操作" width="300px">
               <template #default="scope">
                  <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button>
               </template>
            </el-table-column>
         </el-table>
         <!-- 分页器 -->
         <el-pagination :currentPage="pagedata.pagenum" :page-size="pagedata.pagesize" background
            :page-sizes="[5, 10, 15, 20]" :small="small" :disabled="disabled"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
      </el-card>
   </div>
</template>

<script setup>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiDeletegoodslist, apiGetgoodslist } from '@/apis/goods'
import { daytotime } from '@/request/dayto'
import router from '@/router'

let tableData = ref([])   //储存表格数据
let pagedata = reactive({   //储存分页器数据
   query: '',             //查询参数
   pagenum: 1,           //当前页码
   pagesize: 10        //每页显示条数
})
let total = ref(0)    //总数
// 获取列表数据函数
function getdatalist() {
   apiGetgoodslist(pagedata).then(res => {
      // console.log(res);
      total.value = res.data.total
      tableData.value = res.data.goods
      // console.log(tableData.value);
   })
}
getdatalist()   //获取列表数据
//页面大小改变函数
function handleSizeChange(val) {
   pagedata.pagesize = val     //将页面大小的值赋值

   getdatalist()    //刷新数据函数
}
//第几页改变函数
function handleCurrentChange(val) {
   pagedata.pagenum = val  //将页面大小的值赋值
   getdatalist()        //刷新数据函数
}
//编辑操作
function handleEdit(index, row) {
   console.log('编辑');
}
//删除操作
function handleDelete(index, row) {
   //以下是消息确认框，常用于删除操作
   ElMessageBox.confirm(
      '此操作将删除商品，是否继续',
      'Warning',
      {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning',
      }
   )   //，then代表确定删除
      .then(() => {
         //调用api接口，进行删除
         apiDeletegoodslist(row.goods_id).then(res => {
            // console.log(res);
            getdatalist()     //删除成功后刷新数据
            ElMessage({         //提示消息
               type: 'success',
               message: '删除成功'
            })
         }).catch(err => {
            ElMessage({
               type: 'error',
               message: '网络异常，删除失败'
            })
         })
      })
      //.catch代表取消删除
      .catch(() => {
         ElMessage({
            type: 'info',
            message: '删除取消',
         })
      })
}
//添加操作
function addGoods(){
   router.push('/home/goods/add')
}
</script>
<style scoped>
.eltableda {
   margin-top: 20px;
}

.el-pagination {
   margin-top: 20px;
}
</style>