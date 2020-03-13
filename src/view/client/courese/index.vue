<template>
  <div class="content">
<!--    banner -->
    <banner></banner>

    <div class="title-section">
      <h3>ONLINE COURSES</h3>
      <p class="sub-title">Brand University of Applied Sciences.</p>
    </div>

    <div class="filter-warp section">
      <div class="item class-part" v-for="(item,index) in typeArr">
        <div class="className">{{item.className}}</div>
        <div class="teacher">{{item.teacher}}</div>

        <div class="courese-warp">
          <div v-for="video in item.data"  @click="watch(video._id)" class="flex courese">
            <img class="poster-xsm" src="../../../assets/images/video.png" alt="">
            {{video.name}}
          </div>
          <div v-if="!item.data || !item.data.length">
            Empty
          </div>

        </div>

      </div>
    </div>


    <courseFooters></courseFooters>
  </div>
</template>
<script>
  import $ from 'jquery';
  import { getCourese,watchCourese,getCoureseType } from '../../../api/api';
  import banner from '../../../components/course/course_banner';
  import footer from '../../../components/course/footer';


  export default {
    name: 'course',
    data () {
      return {
        CoureseArr:[],typeArr:[],
      }
    },
    components:{
      banner:banner,
      courseFooters:footer
    },
    mounted() {
      // this.fetch({});
      this.init();
    },
    methods: {
      watch(id){
        this.$router.push({path:'/courese/read',query:{id:id}});
      },
      init(){
        var loading = this.$message({
          showClose: true,
          duration:'30000',
          message: 'Loading...'
        });
        getCoureseType().then((res) => {
          let typeArr = res.data.data;
          this.typeArr = typeArr;
          const self = this;
          for (let i=0;i<typeArr.length;i++){
            let query={};
            query['type.className'] = typeArr[i].className;
              getCourese(query).then(res=>{
                if(res.data.status=='10010'){
                  this.$message({
                    message: '登录过期，请从公众号中重新登录',
                    type: 'error',
                    duration:'30000',
                  })
                }
                self.typeArr[i].data = res.data.data
                self.$forceUpdate();
                // console.log(this.typeArr,i)
                if(i==typeArr.length-1){
                  loading.close();
                  // self.$forceUpdate();
                }
              })
          }
        });
      },
      fetch(query){
        query['type.className']='Advanced Communications Management'
        getCourese(query).then(res=>{
          console.log(res);
          if(res.data.status=='10010'){
            this.$message({
              message: '登录过期，请从公众号中重新登录',
              type: 'error',
              duration:'30000',
            })
          }
          this.CoureseArr = res.data.data
        })
      }
    }
  }

</script>
<style scoped>
  *{font-size: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";}
.content{margin-top: 60px;}


  .title-section{text-align: center;margin: 20px 0;}
  .sub-title{font-size: small;}
  .container{margin: 10px 0;}
  .section{margin: 15px;padding:15px;border: 1px solid rgba(0,0,0,.125);}
  .info{box-shadow: 0 2px 7px 0 #eee; }
  .describe{font-size: 12px;color: #393939;margin-top: 10px;}
  .media{display: flex;justify-items: center;align-items: center;background: #efefef;padding: 15px;margin-bottom: 5px;}
  .media .introduce{font-size: 10px;color: #999;}
.poster-sm{width: 100px;}
.media-info{margin-left: 15px;}
  .fixed-bottom-center{position: fixed;bottom: 0;left: 50%;margin-left: -25%;}
  .hini{font-size: 12px;text-align: center;display: block;width: 100%;}
  .btn{width: 2em;height: 2em;background-position: center;background-repeat: no-repeat;display: inline-block;background-size: cover;}
  .btn.play{background-image: url("../../../assets/images/play.png");}
  .btn.pause{background-image: url("../../../assets/images/pause.png");}
  .className{
    color: #64af28;
    text-decoration: none;
    background-color: transparent;font-size:22px;
    -webkit-font-smoothing:antialiased ;
    font-weight: 600;
    line-height: 1.2;
  }
  .teacher{font-weight: 600;color: #333;}
  .class-part{border-bottom:1px solid rgba(0,0,0,.125); margin-bottom: 15px;padding-bottom: 15px;}
.courese-warp{margin-left: 30px;margin-top: 15px;}
.poster-xsm{width: 1em;height: 1em;display: inline-block;vertical-align: text-bottom;}
.courese{margin-bottom: 10px;}

</style>
