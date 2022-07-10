<template>
   <div class="Categories">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
         <el-breadcrumb-item :to="{ path: '/home' }">后台管理系统</el-breadcrumb-item>
         <el-breadcrumb-item>商品</el-breadcrumb-item>
         <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 面包屑完  -->
      <el-card>
         <el-row>
            <el-col>
               <el-button type="primary" @click="addfenlei">
                  添加分类
               </el-button>
            </el-col>
         </el-row>
         <!-- 表格  -->
         <el-table :data="catnoelist" style="width: 100%; margin-bottom: 20px" row-key="cat_id" border>
            <el-table-column type="index" label="#" />
            <el-table-column prop="cat_name" label="分类名称" width="180" />
            <el-table-column prop="cat_deleted" label="是否有效" width="180">
               <template #default="scope">
                  <!-- {{scope.row}} -->
                  <el-icon v-if="scope.row.cat_deleted === false" style="color: lightgreen;">
                     <CircleCheckFilled />
                  </el-icon>
                  <el-icon v-else style="color: red;">
                     <CircleCloseFilled />
                  </el-icon>

               </template>
            </el-table-column>
            <el-table-column prop="cat_level" label="排序" width="180">
               <template #default="scope">

                  <!-- {{scope.row}} -->
                  <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                  <el-tag size="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                  <el-tag size="warning" v-else>三级</el-tag>

               </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
               <template #default="scope">
                  <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button>
               </template>
            </el-table-column>
         </el-table>
         <!-- 表格完  -->
         <!-- 分页 -->
         <el-pagination layout="total,sizes,prev, pager, next,jumper" :total="total" :page-sizes="[1, 2, 4, 8, 10]"
            :current-page="catlist.pagenum" :page-size="catlist.pagesize" @current-change="PageChange"
            @size-change="Sizechange" />
      </el-card>
      <!-- 添加分类对话框 -->
      <el-dialog @close="closedia" v-model="dialogadd" title="添加分类" width="30%">
         <!-- form表单 -->
         <el-form ref="formRef" :model="addform" :rules="addrulrs">
            <el-form-item label="分类名称" prop="cat_name">
               <el-input v-model="addform.cat_name" />
            </el-form-item>
            <el-form-item label="父级分类">
               <el-cascader v-model="datavalue" clearable :options="adddata" :props="propsadd"
                  @change="handleaddChange" />
            </el-form-item>
         </el-form>
         <template #footer>
            <span class="dialog-footer">
               <el-button @click="dialogadd = false">取消</el-button>
               <el-button type="primary" @click="queding">确定</el-button>
            </span>
         </template>
      </el-dialog>
      <!-- 编辑操作对话框 -->
      <el-dialog @close="closeEditdia" v-model="editVisible" title="修改分类" width="30%">
         <!-- 表单 -->
         <el-form ref="editRef" :rules="addrulrs" :model="editform" label-width="120px">
            <el-form-item prop="cat_name" label="分类名称">
               <el-input v-model="editform.cat_name" />
            </el-form-item>
         </el-form>
         <template #footer>
            <span class="dialog-footer">
               <el-button @click="editVisible = false">取消</el-button>
               <el-button type="primary" @click="rightedit">确定</el-button>
            </span>
         </template>
      </el-dialog>
   </div>
</template>

<script setup>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { apieditdelete, apieditname, apieditgetname, apiGetcatlist, apiaddcat } from '@/apis/categories'
import { ElMessage, ElMessageBox } from 'element-plus'
//获取商品分类数据列表
let catlist = reactive({
   type: 3,
   pagenum: 1,
   pagesize: 1
})
let catnoelist = ref([])
let total = ref(0)
function getCatlist() {
   apiGetcatlist(catlist).then(res => {
      console.log(res);
      catnoelist.value = res.data.result
      total.value = res.data.total
   }).catch(err => {
      ElMessage({
         type: 'error',
         message: '网络异常，请稍后再试'
      })
   })
}
getCatlist()
//完成分页器
//监听page
function Sizechange(val) {
   catlist.pagesize = val
   getCatlist()
}
//监听页面改变
function PageChange(val) {
   catlist.pagenum = val
   getCatlist()
}
//打开添加分类对话框
//级联选择器配置对象
const propsadd = reactive({
   value: 'cat_id',
   label: 'cat_name',
   children: 'children',
   expandTrigger: 'hover',
   checkStrictly: true
})
//储存获取的分类数据
let adddata = ref([])
let datavalue = ref([])
let addform = reactive({
   cat_name: '',
   //父级分类id
   cat_pid: 0,
   cat_level: 0

})
//定义规则
const addrulrs = reactive({
   cat_name: [
      { required: true, message: '请输入分类名称', trigger: 'blur' }
   ],
})
let dialogadd = ref(false)

function addfenlei() {
   dialogadd.value = true
   // datavalue.value=[]
   // console.log(addform);
   getaddlist()
}
//获取分类列表数据
function getaddlist() {
   apiGetcatlist({ type: 2 }).then(res => {
      // console.log(res);
      adddata.value = res.data
   })
}
//级联选择器回调函数
function handleaddChange() {
   // console.log(datavalue.value);
   if (datavalue.value != null) {
      if (datavalue.value.length > 0) {
         addform.cat_pid = datavalue.value[datavalue.value.length - 1]
         addform.cat_level = datavalue.value.length
         return
      }
   }

   else {
      addform.cat_pid = 0
      addform.cat_level = 0
   }
}
//点击确定按钮
function queding() {
   // console.log(datavalue.value);
   // console.log(addform);
   //验证表单并发送请求
   if (!formRef.value) return
   formRef.value.validate((valid) => {
      if (valid) {
         //发送请求
         apiaddcat(addform).then(res => {
            console.log(res);
            //成功消息
            ElMessage({
               type: 'success',
               message: '创建成功'
            })
            //刷新数据
            getCatlist()
            //关闭对话框
            dialogadd.value = false
         }).catch(err => {
            //网络异常消息
            ElMessage({
               type: 'error',
               message: '网络异常，请稍后再试'
            })
         })
      } else {
         // 表单验证失败
         ElMessage({
            type: 'error',
            message: '输入有误，请检查您的输入'
         })
      }
   })
}

//对话框关闭是重置
let formRef = ref(null)
function closedia() {
   formRef.value.resetFields()
   datavalue.value = []
   addform.cat_pid = 0
   addform.cat_level = 0
}
//添加完成
//编辑操作
//控制是否打开对话框
let editVisible = ref(false)
//编辑表单数据
let editform = reactive({
   cat_name: ''
})
//储存分类id
let editid = ref(0)
//储存表单对象
let editRef = ref(null)
//   点击编辑按钮
function handleEdit(index, val) {
   editVisible.value = true
   //获取并储存id
   // console.log(val.cat_id);
   editid.value = val.cat_id
   //根据id获取分类并付给cat_name
   apieditgetname(val.cat_id).then(res => {
      // console.log(res);
      editform.cat_name = res.data.cat_name
   })

}
//点击确定按钮
function rightedit() {
   //验证表单
   if (!editRef.value) return
   editRef.value.validate((valid) => {
      if (valid) {
         //发送请求
         apieditname(editid.value, editform).then(res => {
            console.log(res);
            //成功消息
            ElMessage({
               type: 'success',
               message: '修改成功'
            })
            //刷新数据
            getCatlist()
            //关闭对话框
            editVisible.value = false
         }).catch(err => {
            //网络异常消息
            ElMessage({
               type: 'error',
               message: '网络异常，请稍后再试'
            })
         })
      } else {
         // 表单验证失败
         ElMessage({
            type: 'error',
            message: '输入有误，请检查您的输入'
         })
      }
   })
}
//重置输入框校验
function closeEditdia() {
   editRef.value.resetFields()
}
//编辑部份完成
//删除操作
function handleDelete(index, val) {
   //弹出消息提示框
   ElMessageBox.confirm(
      '此操作将删除此文件，是否确认',
      'Warning',
      {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning',
      }
   )
      .then(() => {
         //发送请求
         // console.log(val.cat_id);
         apieditdelete(val.cat_id).then(res => {
            // console.log(res);
            ElMessage({
               type: 'success',
               message: '删除成功',
            })
            //刷新
            getCatlist()
         }).catch(err => {
            ElMessage({
               type: 'error',
               message: '网络异常，请稍后再试',
            })
         })
      })
      .catch(() => {
         ElMessage({
            type: 'info',
            message: '删除取消',
         })
      })
}
//删除完成，操作结束
</script>
<style lang='scss' scoped>
</style>