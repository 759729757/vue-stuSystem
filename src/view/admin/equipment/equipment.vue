<template>
  <div>
    <el-button type="primary" @click="dialogFormVisible=true,sendNew=true,form={}">新增设备</el-button>

    <el-dialog title="设备详情" :visible.sync="dialogFormVisible" center>
      <el-form ref="form" :model="form" label-width="80px" style="">

        <el-form-item label="设备名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="设备型号">
          <el-input v-model="form.model"></el-input>
        </el-form-item>

        <el-form-item label="单价（元）">
          <el-input type="tel" v-model="form.price"></el-input>
        </el-form-item>

        <el-form-item label="总数">
          <el-input type="tel" v-model="form.amount"></el-input>
        </el-form-item>

        <el-form-item label="购入日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="存放地址">
          <el-input type="text" v-model="form.store"></el-input>
        </el-form-item>

        <el-form-item label="是否开放">
          <el-checkbox v-model="form.putaway">可借</el-checkbox>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="text" v-model="form.note"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" v-if="sendNew" @click="send()">上传</el-button>
          <el-button type="primary" v-else @click="update()">更新</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      :data="tableData"
      height="80vh"
      border stripe
      style="width: 100%;margin-top: 20px;">
      <el-table-column
        prop="name"
        label="名称" sortable
        width="180">
      </el-table-column>

      <el-table-column
        prop="model"
        label="型号" sortable
        width="180">
      </el-table-column>

      <el-table-column
        prop="price"
        label="单价" sortable
        width="180">
      </el-table-column>

      <el-table-column
        prop="amount"
        label="总数" sortable
        width="180">
      </el-table-column>

      <el-table-column
        prop="store"
        label="存放地址" sortable
        width="200">
      </el-table-column>
      <el-table-column
        label="是否可借"
        width="100">
        <template slot-scope="scope">
            <el-link :underline="false">{{ scope.row.putaway ? '可借' : '不可借' }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="note"
        label="备注" sortable
        width="200">
      </el-table-column>

      <el-table-column
        prop="date"
        label="购入日期" sortable
        width="180">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link type="primary"  v-on:click="edit(scope.row)" >编辑</el-link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-link type="danger"  v-on:click="del(scope.row)" >删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      :current-page.sync="page"
      :page-size="20" @current-change="pageChange"
      layout="total, prev, pager, next"
      :total="count">
    </el-pagination>

  </div>
</template>
<script>
  import { getAllEqu,updateEquipment,delEquipment,sendEquipment } from '../../../api/adminApi';
  export default {
    name: 'equipment',
    data(){
      return{
        form:{putaway:false},
        tableData: [],
        sendNew:false,
        dialogFormVisible:false,
        count:0,page:0,
      }
    },
    methods:{
      pageChange:function(){
        console.log(this.page);
        this.fetch();
      },
      send:function () {
        sendEquipment(this.form).then(res => {
          let{ status } = res;
          if(status === 1){
            this.$message.success('发布成功');
            this.dialogFormVisible=false;
            this.form = {putaway:false};
            this.fetch();
          }else {
            this.$message.error('请重试')
          }
        })
      },
      update:function(){
        updateEquipment(this.form).then(res => {
          let{ status } = res.data;
          if(status === 1){
            this.dialogFormVisible = false;
            this.$message.success('修改成功');
            this.getAllEqu();
          }else {
            this.$message.error('请重试')
          }
        })
      },
      edit:function (data) {
        this.form = data;
        this.sendNew = false;
        this.dialogFormVisible = true;
      },
      del:function (data) {
        let id = data._id,name = data.name;
        this.$confirm(`是否删除${name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delEquipment({_id:id}).then(res=>{
            let{ status } = res.data;
            if(status === 1){
              this.$message.success('删除');
              this.getAllEqu();
            }else {
              this.$message.error('请重试')
            }
          });
        })
      },
      fetch:function () {
        getAllEqu().then(res=>{
          let {data,count} = res.data;
          this.count = count;
          this.tableData = data;
        })
      }
    },
    mounted () {
      this.fetch();
    },
  }
</script>

<style scoped>

</style>
