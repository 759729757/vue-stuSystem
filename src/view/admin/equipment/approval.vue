<template>
<div>

  <el-collapse @change="queryToogle">
    <el-collapse-item >
      <template slot="title" >
        <el-link type="primary shai-title" icon="el-icon-search">筛选项</el-link>
      </template>
      <el-form label-width="80px" >

        <el-form-item label="设备：" prop="checkEquList">
          <el-checkbox-group v-model="checkEquList" @change="fetch">
            <el-checkbox label="佳能760D相机"></el-checkbox>
            <el-checkbox label="三脚架"></el-checkbox>
            <el-checkbox label="D3303工作室"></el-checkbox>
            <el-checkbox label="耦合空间" ></el-checkbox>
            <el-checkbox label="D3303摄影棚" ></el-checkbox>
            <el-checkbox label="其他" ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="状态：" prop="checkStatusList">
          <el-checkbox-group v-model="checkStatusList" @change="fetch">
            <el-checkbox label="0" >申请</el-checkbox>
            <el-checkbox label="1">已通过</el-checkbox>
            <el-checkbox label="2">未通过</el-checkbox>
            <el-checkbox label="3" >在借</el-checkbox>
            <el-checkbox label="4">已归还</el-checkbox>
            <el-checkbox label="5">逾期归还</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button @click="checkStatusList=[];checkEquList=[];fetch()">重置选项</el-button>
        </el-form-item>

      </el-form>

    </el-collapse-item>
  </el-collapse>

  <el-dialog title="借用详情" :visible.sync="dialogFormVisible" center>
    <equTable :form="form" @closeDialog="closeDialog" @reload="fetch"></equTable>
  </el-dialog>


  <el-table
    :data="listArr"  v-loading="loading"
    :height="queryShow" style="transition: height .3s ease-in;"
    border stripe
   >
      <el-table-column label="序号" width="50" type="index" align="center"></el-table-column>

      <el-table-column label="姓名" width="100" prop="name" sortable></el-table-column>

      <el-table-column label="专业" width="180" prop="major" sortable></el-table-column>

      <el-table-column label="申请设备" width="" prop="equipName"></el-table-column>

      <el-table-column label="借用时间" width="" :formatter="formatUseTime" sortable></el-table-column>

      <el-table-column label="审批" width="100" align="center" sortable>
        <template slot-scope="scope">
          <el-link
            :type="status[scope.row.status]" :underline="false"
            disable-transitions>{{ statusText[scope.row.status] }}</el-link>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button @click="approval(scope.row)" type="text" size="small">审批</el-button>
          <el-button @click="urge(scope.row)" type="text" size="small">催还</el-button>
          <el-button type="text" @click="del(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>

  </el-table>


</div>
</template>

<script>
  import { getEquApplylist,getOneEquRecode,deleteEquRecode,urgeEquipment } from '../../../../src/api/adminApi.js';
  import equTable from '../../../../src/components/admin_equipmentTable'
  export default {
    name: 'approval',
    data(){
      return{
        loading:false,dialogFormVisible:false,
        queryShow:'82vh',
        status : ['','warning','danger','info','success','danger'],
        statusText :['审批','已通过','不通过','在借','已归还','逾期归还'],
        listArr:[],checkEquList:[],checkStatusList:[],
        form:{},//这个是申请详情

      }
    },
    components:{
      equTable:equTable
    },
    methods:{
      urge:function(item){
        this.$confirm(`是否发送催还短信给 ${item.name} 同学？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          urgeEquipment({phone:item.phone}).then(res=>{
            this.$message({
              type: 'success',
              message: '发送成功!'
            });
          })
        })
      },
      closeDialog:function(){
        this.dialogFormVisible = false;
      },
      approval:function(item){
        let _action = ['reply','borrow','reply','reback','borrow','borrow'],
          action = _action[item.status];
        let data ={
          action:action,id:item.id
        }
        getOneEquRecode(data).then( res=>{
          console.log(res.data);
          let {recode,nearlyRecode } = res.data;
          this.form = recode;
          this.dialogFormVisible = true;
        } )

      },
      queryToogle:function(val){
        this.queryShow = val.length ? '66vh' : '82vh';
      },
      del:function(row){
        if (row.status != 0) {
          this.$message({
            message: '只能删除状态为“审批”的记录',
            type: 'warning'
          });
          return;
        }
        let id = row.id;
        this.$confirm(`是否删除该条 ${row.name} ${row.equipName} 记录`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteEquRecode({id:id}).then(res=>{
            if(res.data.status===1){
              this.$message.success('删除成功')
              this.fetch();
            }else{
              this.$message.error('请重试')
            }
          })
        })
      },
      fetch:function(){
        this.loading=true;
        let data={_:new Date().valueOf()},
        checkEquList = this.checkEquList , _checkEquList='' ,
        checkStatusList = this.checkStatusList , _checkStatusList='';


        checkEquList.length && checkEquList.forEach( item => {
          // _checkEquList += item+'.*';
          _checkEquList += _checkEquList ? '|'+item : item;
        })
        checkStatusList.length && checkStatusList.forEach( item => {
          _checkStatusList += _checkStatusList ? '|'+item : item;
        })

        _checkEquList.length &&(data.equipment = _checkEquList)
        _checkStatusList.length && (data.status = _checkStatusList)


        getEquApplylist(data).then( list =>{
          this.listArr = list.data;
          this.loading=false;
        })
      },
      formatUseTime:function(row){
        return row.startTime+' 至 '+row.endTime;
      },
      formatStatus:function (row) {
        const status =['审批','已通过','不通过','在借','已归还','逾期归还'];
        let _status = status[row.status];
        return _status;
      }
    },
    mounted () {

     this.fetch();

    }
  }
</script>

<style scoped>
.shai-title{padding-left: 2em;}
</style>
