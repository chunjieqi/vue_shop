<template>
   <div class="Orders">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
         <el-breadcrumb-item :to="{ path: '/home' }">后台管理系统</el-breadcrumb-item>
         <el-breadcrumb-item>订单管理</el-breadcrumb-item>
         <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 面包屑完  -->
      <!-- 卡片视图 -->
      <el-card>
         <el-row class="nihao">
            <el-col :span="6">
               <!-- 搜索框 -->
               <el-input clearable @clear="clearSearch" v-model="formInfo.query" placeholder="请输入内容">
                  <template #append>
                     <!-- 搜索按钮 -->
                     <el-button @click="Searchlist">
                        <el-icon>
                           <Search />
                        </el-icon>
                     </el-button>
                  </template>
               </el-input>
            </el-col>
         </el-row>
         <!-- 搜索完 -->
         <!-- 表格部分 -->
         <el-row class="nihao">
            <el-col :span="24">
               <!-- table表格 -->
               <el-table :data="dataInfo" border stripe style="width: 100%">
                  <el-table-column type="index" label="#" width="50px" />
                  <el-table-column prop="order_number" label="订单编号" width="180" />
                  <el-table-column prop="order_price" label="订单价格" width="180" />
                  <el-table-column prop="pay_status" label="是否支付">
                     <template #default="scope">
                        <el-tag v-if="scope.row.pay_status === 1" type="success">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                     </template>
                  </el-table-column>
                  <el-table-column prop="is_send" label="是否发货" />
                  <el-table-column prop="create_time" label="下单时间">
                     <template #default="scope">
                        {{ daytotime(scope.row.create_time) }}
                     </template>
                  </el-table-column>
                  <el-table-column label="操作">
                     <template #default="scope">
                        <el-tooltip class="box-item" effect="dark" content="修改地址" placement="top">
                           <el-button type="primary" @click="addff" circle>
                              <el-icon>
                                 <EditPen />
                              </el-icon>
                           </el-button>
                        </el-tooltip>
                        <el-tooltip class="box-item" effect="dark" content="物流状态" placement="top">
                           <el-button type="success" @click="statusLook" circle>
                              <el-icon>
                                 <AddLocation />
                              </el-icon>
                           </el-button>
                        </el-tooltip>
                     </template>
                  </el-table-column>
               </el-table>
            </el-col>
         </el-row>
         <!-- 分页部分 -->
         <el-row>
            <el-col :span="24">
               <el-pagination v-model:currentPage="formInfo.pagenum" v-model:page-size="formInfo.pagesize"
                  :page-sizes="[4, 6, 8, 10]" :small="small" :disabled="disabled" :background="background"
                  layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                  @current-change="handleCurrentChange" />
            </el-col>
         </el-row>
         <!-- 对话框：物流状态 -->
         <el-dialog v-model="statusdialogVisible" title="物流状态" width="30%">
            <el-timeline>
               <el-timeline-item v-for="(item, index) in statuschucun" :key="index" :timestamp="item.time">
                  {{ item.context }}
               </el-timeline-item>
            </el-timeline>
            <template #footer>
               <span class="dialog-footer">
                  <el-button type="primary" @click="statusdialogVisible = false">确定</el-button>
               </span>
            </template>
         </el-dialog>
         <!-- //对话框，修改地址 -->
         <el-dialog @close="cleardia" v-model="adddialogVisible" title="修改地址" width="30%">
            <el-form ref="formRef" :model="goodsform" :rules="rules" label-width="120px">
               <el-form-item prop="name" label="收货地址">
                  <el-input v-model="goodsform.name" />
               </el-form-item>
            </el-form>
            <template #footer>
               <span class="dialog-footer">
                  <el-button type="info" @click="adddialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="adddialogVisible = false">确定</el-button>
               </span>
            </template>
         </el-dialog>
      </el-card>
   </div>
</template>

<script setup>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiGetorderStatus, apiGetorderlist } from '@/apis/order'
import { daytotime } from '@/request/dayto'
let formInfo = reactive({      //储存获取列表参数，用于搜索和换页
   query: '',
   pagenum: 1,
   pagesize: 6
})
let total = ref(0)       //分页器的总数据数
//获取列表部分
let dataInfo = ref([])   //储存表格数据
//获取列表函数
function getOrderlist() {
   apiGetorderlist(formInfo).then(res => {
      // console.log(res);
      dataInfo.value = res.data.goods
      total.value = res.data.total
   })
}
getOrderlist()  //获取列表
//分页部分
//改变分页尺寸函数
function handleSizeChange() {
   getOrderlist()
}
//换页函数
function handleCurrentChange() {
   getOrderlist()
}
//搜索部分
//搜索框清空函数
function clearSearch() {
   getOrderlist()
}
//搜索按钮函数
function Searchlist() {
   getOrderlist()
}
//搜索完成
//修改收件地址
let goodsform = reactive({
   name: ''
})
let adddialogVisible = ref(false)
//定义规则
let formRef = ref(null)
const rules = reactive({
   name: [
      { required: true, message: '请输入收货地址', trigger: 'blur' },
   ],
})
//清空
function cleardia() {
   formRef.value.resetFields()
}
function addff() {
   adddialogVisible.value = true
}
// 修改操作完成
//获取物流状态
let statuschucun = ref([])    //储存状态信息
let statusdialogVisible = ref(false)   //控制对话框显示与隐藏
//点击按钮时，显示对话框，并请求数据
function statusLook() {
   statusdialogVisible.value = true
   getOrderstatue()
}
function getOrderstatue() {
   apiGetorderStatus(1106975712662).then(res => {
      statuschucun.value = res.data.reverse()
   })
}
// getOrderstatue()
</script>
<style  scoped>
.nihao{
   margin-bottom: 20px;
}
</style>