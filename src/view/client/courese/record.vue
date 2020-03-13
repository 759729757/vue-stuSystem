<template>
  <div>
    <banner></banner>
    <!--列表-->
    <el-table :data="readRecord" highlight-current-row v-loading="listLoading" stripe class="table">
      <!--<el-table-column type="selection" width="55"></el-table-column>-->
<!--      <el-table-column type="index" width="15"></el-table-column>-->
      <el-table-column prop="videoInfo.name" label="Videos Name" sortable></el-table-column>
<!--      <el-table-column prop="videoInfo.type.teacher" label="Lecturer" width="130" sortable align="center"></el-table-column>-->
<!--      <el-table-column prop="readTimes" label="观看时常" width="100" sortable></el-table-column>-->
      <el-table-column label="Watch Time" width="150" prop="watchTime" align="center">
        <template slot-scope="scope" >
          {{  scope.row.watchTime|toMinutes }}
        </template>
      </el-table-column>

    </el-table>

    <courseFooters></courseFooters>

  </div>
</template>

<script>
  import banner from '../../../components/course/course_banner';
  import footer from '../../../components/course/footer';
  import { fetchReadRecord } from '../../../api/api';

  export default {
    name: 'record',
    components: {
      banner:banner,
      courseFooters:footer
    },
    data(){
      return{
        readRecord:[],listLoading:false,
      }
    },
    methods:{
      fetchRecord(){
        var loading = this.$message({
          showClose: true,
          duration:'30000',
          message: 'Loading...'
        });
        fetchReadRecord().then(res => {
          console.log('fetchReadRecord',res)
          this.listLoading = true;
          if(res.data.data){
            this.listLoading = false;
            loading.close();
            res.data.data.sort(compare("watchTime"))
            this.readRecord = res.data.data;//学习记录
          }
        })
      },
    },
    mounted () {
      this.fetchRecord();
    },
    filters:{
      toMinutes:function(time) {
        console.log(time)
        time = Math.floor(time);//把传进来的秒数转成整数
        let min=0,sec=0;
        min = Math.floor(time/60);
        sec = time%60;
        return (min ? min+' Mins': '')+' '+(sec ? sec+'s': '');
      }
    },
  }

  var compare = function (prop) {
    return function (obj1, obj2) {
      var val2 = obj1[prop];
      var val1 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  }
</script>

<style scoped>
.table{margin-top: 50px;}
</style>
