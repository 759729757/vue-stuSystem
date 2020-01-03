<template>
    <div>
      <div class="el-row--flex is-flex">
        <div>
          <span class="demonstration">讲座日期：</span>
          <el-date-picker
            v-model="lectureDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        &nbsp;&nbsp;&nbsp;
        <div>
          <span class="demonstration">讲座日期：</span>
          <el-input class="input" v-model="name" placeholder="讲座名称"></el-input>
        </div>
        <div>
          <el-button icon="el-icon-arrow-left" v-if="lectureRecord.length && !drawer" @click="drawer=true">展开记录</el-button>
        </div>
      </div>
      <div class="el-row--flex is-flex el-row">
        <div class="block">
          <span class="demonstration" >开始时间：</span>
          <el-input class="input" v-model="startTime" placeholder="讲座名称"></el-input>
        </div>
        &nbsp;&nbsp;&nbsp;
        <div class="block">
          <span class="demonstration" >结束时间：</span>
          <el-input class="input" v-model="endTime" placeholder="讲座名称"></el-input>
        </div>
      </div>
      <div class="el-row--flex is-flex el-row">
        <el-checkbox v-model="sendAll">提交全部</el-checkbox>
        <el-checkbox v-model="sendSign">仅提交有签到和签退</el-checkbox>
      </div>
      <div class="el-row--flex is-flex el-row">
        <el-button type="primary" @click="sendRecord">提交</el-button>
      </div>

      <el-drawer
        title="打卡记录"
        :visible.sync="drawer"
        :direction="direction"
      >

        <el-table
          :data="lectureRecord"
          style="width: 100%" height="90vh">
          <el-table-column type="index" width="60">				</el-table-column>

          <el-table-column
            prop="student"
            label="学号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="signstartTime"
            label="签到时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="signendTime"
            label="签退时间">
          </el-table-column>
        </el-table>

      </el-drawer>
    </div>
</template>

<script>
  import { oldUrl } from '../../../config'
  import { getLectureInfo,sendLectureResult } from '../../../api/adminApi'
  export default {
    name: 'lecture',
    data(){
      return{
        lectureDate:new Date(),
        name:new Date().toLocaleDateString().replace(/\//g,'-')+' ',
        startTime:'',endTime:'',

        lectureRecord:[],
        drawer: false,
        direction: 'rtl',
        sendSign:false,sendAll:false
      }
    },
    watch:{
      lectureDate:function (date) {
        if(!date)return false;
        date = date.toLocaleDateString().replace(/\//g,'-');
        this.name = date+' '
        this.startTime = date+' 19:00'
        this.endTime = date+' 20:10'

        this.drawer = true;
        this.iframe = `${oldUrl}/getLectureInfo?lecture=${date}`;
        getLectureInfo({ lecture:date }).then(res=>{
          this.lectureRecord = res.data.data;
        })
      },
    },
    methods:{
      sendRecord:function () {
        this.$confirm(`是否上传讲座记录 ${this.name}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sendLectureResult({
            date:this.lectureDate.toLocaleDateString().replace(/\//g,'-'),
            name:this.name,
            startTime:this.startTime,
            endTime:this.endTime,
            sendAll:this.sendAll,
            sendSign:this.sendSign
          }).then(res=>{
            this.$alert(res.mess, '提示', {
              confirmButtonText: '确定',
              callback: action => {

              }
            });
          })

        })
      }

    }
  }
</script>

<style scoped>
  .demonstration{width: 5em;display: inline-block;text-align: right;}
  .el-row{margin-bottom: 20px;}
.input{
  width: 220px;
}
</style>
