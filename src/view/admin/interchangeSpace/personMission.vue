<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filter">
        <el-form-item>
          <el-input v-model="filter.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filter.stuNum" placeholder="学号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filter.grade" placeholder="年级"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filter.major" placeholder="专业"></el-input>
        </el-form-item>
        <el-select v-model="filter.isBind" placeholder="请选择">
          <el-option value="" label="绑定微信"></el-option>
          <el-option value="1" label="已绑定"></el-option>
          <el-option value="-1" label="未绑定"></el-option>
        </el-select>
        <el-form-item>
          <el-button type="primary" v-on:click="fetch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="users" highlight-current-row v-loading="loading" height="80vh" stripe>
        <el-table-column type="index" width="60">				</el-table-column>

        <el-table-column prop="name" label="姓名" sortable>			</el-table-column>

        <el-table-column  label="学号"  sortable>
          <template slot-scope="scope">
            {{ scope.row.stuNum|formatStuNum  }}
          </template></el-table-column>

        <el-table-column prop="grade" label="年级" sortable>
          <template slot-scope="scope">
            {{ scope.row.grade|formatMajor  }}
          </template>
        </el-table-column>

        <el-table-column prop="major" label="专业" sortable></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="info" v-on:click="edit(scope.row)" plain>查看</el-button>
          </template>
        </el-table-column>


      </el-table>
    </template>

    <!--分页-->
    <el-pagination
      :current-page.sync="filter.page"
      :page-size="20" @current-change="pageChange"
      layout="total, prev, pager, next"
      :total="count">
    </el-pagination>


    <el-dialog title="个人详情" :visible.sync="dialogFormVisible" center>
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-link type="default" :underline="false">{{ editForm.user&&editForm.user.name || editForm.name }}</el-link>
        </el-form-item>
        <el-form-item label="专业">
          <el-link type="default" :underline="false">{{ (editForm.user&&editForm.user.major || editForm.major)|formatMajor }}</el-link>
        </el-form-item>
        <el-form-item label="学号">
          <el-link type="default" :underline="false">{{ (editForm.stuNum) | formatStuNum }}</el-link>
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
          <el-checkbox-group v-model="editForm.openWeek">
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
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteOne(editForm.stuNum)"></el-button>

        </el-form-item>
      </el-form>
    </el-dialog>
  </section>

</template>

<script>
  import { getPermission,addOnePermission,getOneUser,delPermission } from '../../../api/adminApi'
  let permission ={
    user:''
    ,stuNum:''//学号
    ,openDoorLevel:''//开门权限，1代表一楼（大门），2代表2楼，3代表3楼，（高楼层可开全部低楼层）
    ,openWeek:[]//可以开门的时间用星期来确定,默认都可以,每个星期,0为星期日
    ,openTimeStart:''//可开门时间，默认空
    ,openTimeEnd:''//到期时间，默认空
  }
  export default {
    name: 'personMission',
    data(){
      return{
        filter: {
          page:1,
        },
        loading: false,dialogFormVisible:false,
        users: [],count:0,

        checkAll:false,isIndeterminate: true,
        editForm:{user:{},openDoorLevel:0,stuNum:'',}
      }
    },
    methods:{
      deleteOne(stuNum){
        this.$confirm(`是否删除 ${this.editForm.user && this.editForm.user.name || this.editForm.name} 用户权限 `, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delPermission({stuNum:stuNum}).then(res=>{
            if(res.data.errmsg === 0){
              this.$message.success('删除成功！');
              this.dialogFormVisible = false;
            }
          })
        })

      },
      handleCheckAllChange(val) {
        this.editForm.openWeek = val ? ['1','2','3','4','5','6','0'] : [];
        this.isIndeterminate = false;
      },
      closeDialog:function(){
        this.dialogFormVisible = false;
      },
      edit:function(data){
        console.log('edit',data)
        getPermission({stuNum:data.stuNum}).then( res => {
          console.log(res);
          if(!res.data.data){
            this.editForm={
              ...data,
              openWeek:[]
            };
          }else{
            this.editForm=res.data.data;
          }
          this.dialogFormVisible = true;
        })

      },
      pageChange:function(){
        console.log(this.page);
        this.fetch();
      },
      update:function(){
        console.log(this.editForm)

        this.editForm.user = this.editForm._id;
        delete this.editForm['_id'];//把_id删除，不然后台更新不了，会报错

        addOnePermission(this.editForm).then(res=>{
          if(res.errmsg === 0){
            this.$message.success('修改成功！');
            this.dialogFormVisible=false;
          }
        })
      },
      //获取用户列表
      fetch: function () {
        this.loading = true;
        getOneUser(this.filter).then((res)=>{
          console.log(res)
          this.loading = false;
          this.count = res.data.count;
          this.users = res.data.users;
        })
      },

    },
    filters:{
      level:function (val) {
        let level='';
        switch (val) {
          case '1':
            level='仅一楼';
            break;
          case '2':
            level='一，二楼'
            break;
          case '3':
            level='一，二，三楼'
            break;
          default:
            level='---';
        }
        return level
      },
      formatStuNum:function (val) {
        return val ? val.replace(/a$/,'') : '';
      },
      formatMajor:function (val) {
        return (val === 0) ? '教师' : val
      }
    },
    mounted() {
      this.fetch();
      // this.testlogin();
    }
  }
</script>

<style scoped>

</style>
