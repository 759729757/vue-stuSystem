<template>
  <el-container>
    <!--列表-->
    <el-main>
      <el-table :data="users" highlight-current-row v-loading="loading" height="80vh" stripe>
        <el-table-column type="index" width="60">				</el-table-column>

        <el-table-column prop="stuName" label="姓名" width="100" sortable>			</el-table-column>

        <el-table-column prop="stuNum" label="学号" width="150"  sortable>				</el-table-column>
        <el-table-column prop="name" label="项目名" width="150" sortable>				</el-table-column>

        <el-table-column prop="detail" label="详情" width="250" sortable>				</el-table-column>

        <el-table-column prop="score" label="申请分数" width="100" align="center" sortable>        </el-table-column>

        <el-table-column prop="status" label="状态" width="100" align="center" sortable>
          <template slot-scope="scope">
            <el-link
              @click="setStatus(scope.row)"
              :type="status[scope.row.status]" :underline="false"
              disable-transitions>{{ statusText[scope.row.status] }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="alltimes" label="删除" width="100" align="center" sortable>
          <template slot-scope="scope">
            <el-link
              @click="del(scope.row)"
              type="info" :underline="false"
              disable-transitions>
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-main>


    <el-dialog
      title="管理员审批"
      :visible.sync="dialogVisible"
      width="50%"
      >
      <el-form :model="editItem" status-icon label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="stuName">
          <el-input type="text" v-model="editItem.stuName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="stuNum">
          <el-input type="text" v-model="editItem.stuNum" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="项目" prop="name">
          <el-input type="text" v-model.text="editItem.name"></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="detail">
          <el-input type="textarea" v-model.text="editItem.detail"></el-input>
        </el-form-item>
        <el-form-item label="申请学分" prop="score">
          <el-input v-model.text="editItem.score"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model.text="editItem.phone"></el-input>
        </el-form-item>
        <el-form-item label="凭证" prop="photo">
          <span v-if="!editItem.photo">暂无</span>
          <a v-else :href="'http://de.bnuz.edu.cn/stuInfoSystem/volunteerPhotos/'+ editItem.photo " target="_blank">
            <img class="photo"  :src="'http://de.bnuz.edu.cn/stuInfoSystem/volunteerPhotos/'+ editItem.photo " alt="">
          </a>
        </el-form-item>
        <el-form-item label="审批" prop="status">
          <el-radio v-model="isPass" label="1">通过</el-radio>
          <el-radio v-model="isPass" label="2">不通过</el-radio>
        </el-form-item>
        <el-form-item label="意见" prop="advise">
          <el-input v-model.text="editItem.advise"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="editItem.status == '0' ">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" >确 定</el-button>
      </span>
    </el-dialog>

  </el-container>

</template>

<script>
  import { getVolunteerTime,delVolunteerTime,approvalVolunteerTime } from '../../../../src/api/adminApi.js';
  import { oldLecture,lecture } from '../../../../src/api/api.js';
  export default {
    name: 'lectureStatistics',
    data(){
      return{
        loading:false,dialogVisible:false,
        count:0,
        users:[],
        editItem:{},//即将修改的数据
        status : ['info','success','danger'],
        statusText :['审批','已通过','不通过'],
        isPass:'',//审批是否通过。1是通过，2不通过
      }
    },
    methods:{
      del:function(item){
        this.$confirm(`确定删除 ${item.stuName} 该条数据吗`,'请确认',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delVolunteerTime(
            {
              _id:this.editItem._id
            }
          ).then(res=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.dialogVisible = false;
            this.editItem = {};//初始化设置
            this.fetch();
          })
        })
      },
      submit:function(){
        if(!this.isPass){
          this.$message({
            type:'warning',
            message:'请选择是否审批',
            duration:2000
          })
          return
        }
        this.$confirm(`提交后无法修改，请确认`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.editItem.status = this.isPass;
          approvalVolunteerTime(this.editItem).then(res=>{
            this.$message({
              type: 'success',
              message: '发送成功!'
            });
            this.dialogVisible = false;
            this.editItem = {};//初始化设置
            this.fetch();
          })
        })
      },
      setStatus:function(item){
        console.log(item)
        // if(item.status !=='0')return;
        this.editItem = item;
        this.isPass = this.editItem.status;
        this.dialogVisible= true;
      },
      queryMajor(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        cb(this.restaurantsMajor);
      },
      queryGrade(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        cb(this.restaurantsGrade);
      },
//获取列表
      fetch: function () {
        this.loading = true;
        this.users=[];
        getVolunteerTime(this.filter).then((res)=>{
          console.log('getVolunteerTime',res)
          this.count = res.data.length;
          this.users = res.data;
          let users = res.data;

          let page=0;const limit = 20;

          if(!users.length){
            this.$message({
              type:'warning',
              message:'找不到数据'
            })
          }
          this.loading = false;
        })
      },


    },
    mounted () {
      this.fetch()
    }
  }
</script>

<style scoped>
  .photo{max-width: 100%;}

</style>
