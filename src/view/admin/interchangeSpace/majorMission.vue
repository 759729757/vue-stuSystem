<template>
  <div>
    <el-button type="primary" @click="dialogFormVisible=true,editForm={openTime:[]}">新增专业</el-button>
    <br><br>

    <el-table :data="data" highlight-current-row v-loading="loading" height="80vh" stripe>
      <el-table-column prop="major" label="专业" sortable width="300"></el-table-column>
      <el-table-column prop="grade" label="年级" sortable width="300"></el-table-column>
      <el-table-column prop="openDoorLevel" label="权限" sortable width="300"></el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-link type="primary"  v-on:click="edit(scope.row)" >编辑</el-link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-link type="danger"  v-on:click="del(scope.row)" >删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      :current-page.sync="filter.page"
      :page-size="20" @current-change="pageChange"
      layout="total, prev, pager, next"
      :total="count">
    </el-pagination>

    <el-dialog title="个人详情" :visible.sync="dialogFormVisible" center>
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="专业">
          <!--<el-link type="default" :underline="false">{{ editForm.major|formatMajor }}</el-link>-->
          <el-input type="text" v-model="editForm.major"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input type="text" v-model="editForm.grade"></el-input>
        </el-form-item>
        <el-form-item label="访问权限">
          <el-select v-model="editForm.openDoorLevel" placeholder="请选择">
            <el-option value="0" label="不允许"></el-option>
            <el-option value="1" label="仅一楼"></el-option>
            <el-option value="2" label="一二楼"></el-option>
            <el-option value="3" label="一二三楼"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="允许时间">
          <el-checkbox  label="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="editForm.openTime">
            <el-checkbox label="1" >周一</el-checkbox>
            <el-checkbox label="2" >周二</el-checkbox>
            <el-checkbox label="3" >周三</el-checkbox>
            <el-checkbox label="4" >周四</el-checkbox>
            <el-checkbox label="5" >周五</el-checkbox>
            <el-checkbox label="6" >周六</el-checkbox>
            <el-checkbox label="0" >周日</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="生效时间">
          <el-col :span="6">
            <el-date-picker type="datetime" placeholder="开始日期" v-model="editForm.openTimeStart" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col :span="7">
            至
            <el-date-picker type="datetime" placeholder="结束日期" v-model="editForm.openTimeEnd" style="width: calc(100% - 2em);"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-on:click="update">设置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import { getPermissionMajor ,addOnePermissionMajor,delMajormission } from '../../../api/adminApi'
  export default {
    name: 'majorMission',
    data(){
      return{
        data:[],
        loading: false,dialogFormVisible:false,
        filter:{page:1},count:0,
        editForm:{openDoorLevel:0,}
      }
    },
    filters:{
      formatMajor:function (val) {
        return (val === 0) ? '教师' : val
      }
    },
    methods:{
      handleCheckAllChange(val) {
        this.editForm.openTime = val ? ['1','2','3','4','5','6','0'] : [];
        this.isIndeterminate = false;
      },
      del:function(data){
        this.$confirm(`是否删除 ${data.grade}级${data.major} 权限 `, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delMajormission({_id:data._id}).then(res=>{
            if(res.data.errmsg === 0){
              this.$message.success('删除成功！');
              this.dialogFormVisible = false;
              this.fetch();
            }
          })
        })
      },
      edit:function(data){
        console.log('edit',data)
        this.editForm={};
        this.editForm={
          ...data
        };
        this.dialogFormVisible = true;

      },
      pageChange:function(){
        console.log(this.page);
        this.fetch();
      },
      update:function(){
        console.log(this.editForm)
        addOnePermissionMajor(this.editForm).then(res=>{
          if(res.errmsg === 0){
            this.$message.success('修改成功！');
            this.dialogFormVisible=false;
            this.fetch();
          }
        })
      },
      fetch(){
        this.loading = true;
        getPermissionMajor(this.filter).then(res=>{
          console.log(res)
          this.data = res.data.data;
          this.loading = false;
          this.count = res.data.amount;
        })
      }
    },
    mounted () {
      this.fetch()
    },

  }
</script>

<style scoped>

</style>
