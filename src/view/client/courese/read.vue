<template>
  <div class="">
    <banner></banner>

    <div class="input_video"  >
      <video-player  class="video-player vjs-custom-skin"
                     ref="videoPlayer"
                     :playsinline="false"
                     :options="playerOptions"
                     @ready="playerReady"
                     @pause="onPlayerPause($event)"
                     @play="onPlayerPlay($event)"
                     @timeupdate="onTimeupdate($event)"
                     @ended="onPlayerEnded($event)"
      ></video-player>
<!--      <div class="control-bar">-->
<!--        <span class="btn pause" v-if="!isPlay" @click="playerPlay()"></span>-->
<!--        <span class="btn play" v-if="isPlay" @click="playerPause()"></span>-->
<!--      </div>-->
    </div>
    <div class="content">
      <div class="section info">
        <h3>
          {{ courese.name }}
        </h3>
        <p class="describe">
          Course:{{ courese.type && courese.type.className }}
        </p>
        <p class="describe" v-if="courese.teacher">
          Lecturer:{{ courese.type && courese.type.teacher }}
        </p>
      </div>


      <!--    相关课程视频推荐-->
      <div class="relevant-warp">
        <h3 class="session-title">Relevant Videos</h3>

        <div class="courese-warp">
          <div v-for="video in CoureseArr"  @click="watch(video._id)" class="flex courese">
            <img class="poster-xsm"  src="../../../assets/images/video.png" alt="">
            {{video.name}}
            <!--          &nbsp;&nbsp;  <span class="describe">{{video.type.teacher}}</span>-->
          </div>

        </div>

      </div>

      <!--上传学习记录-->
      <div class="hini-warp flex-between form info bg-warning timer-warp"  >
        <div>
            <p class="text-sm" v-if="readRecord">
              Have been watching {{ readRecord.watchTime|toMinutes}}
            </p>
        </div>
        <div>
          Upload record
          <div class="btn-upload" @click="uploadRecord()"></div>
        </div>

      </div>

    </div>


<!--    课程学习情况  -->
<!--      <div class="fixed-bottom-center" v-if="readSecond">-->
<!--        <span class="hini">-->
<!--          你目前已观看该视频课程：{{ readSecond|toMinutes }}-->
<!--        </span>-->
<!--      </div>-->

      <courseFooters class="footer"></courseFooters>
  </div>
</template>
<script>
  import { videoPlayer } from 'vue-video-player'
  import { getCourese,watchCourese,uploadReadRecord,fetchReadRecord } from '../../../api/api';
  import axios from 'axios';
  require('video.js/dist/video-js.css')
  require('vue-video-player/src/custom-theme.css')
  import $ from 'jquery';
  import banner from '../../../components/course/course_banner';
  import footer from '../../../components/course/footer';

  export default {
    name: 'course',
    components: {
      videoPlayer,
      banner:banner,
      courseFooters:footer
    },
    data () {
      return {
        courese:{name:'',introduce:''},
        CoureseArr:[],
        readRecord:{},//上一次的学习记录
        startDate:'',
        // 视频播放
        readSecond:0,//记录已观看时间
        isPlay:false,//是否在播放
        doubleClick:false,//检测双击
        playerOptions : {
          playbackRates : [ 0.7, 1.0], //可选择的播放速度
          autoplay : false, //如果true,浏览器准备好时开始回放。
          muted : false, // 默认情况下将会消除任何音频。
          loop : false, // 视频一结束就重新开始。
          preload : 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language : 'zh-CN',
          aspectRatio : '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid : true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources : [ {
            type : "",
            src : 'http://de.bnuz.edu.cn/stuinfosystem/baVideo.mp4'//url地址
          } ],
          poster : "", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage : '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          // controls:false,//隐藏控制条
          controlBar : {
            timeDivider : true,//当前时间和持续时间的分隔符
            durationDisplay : true,//显示持续时间
            remainingTimeDisplay : false,//是否显示剩余时间功能
            fullscreenToggle : true,  //全屏按钮
            // progressControl:false,//隐藏进度条
            volumePanel:false, //隐藏声音开关按钮

          }
        }
      }
    },
    methods: {
      beforeunloadFn() {
        console.log('页面刷新或关闭')
        this.uploadRecord(); //上传学习记录
      },
      fetchRecord(){
        fetchReadRecord({videoId:this.$route.query.id}).then(res => {
          console.log('fetchReadRecord',res)
          if(res.data.data){
            this.readRecord = res.data.data[0];//之前的学习记录
          }
        })
      },
      //上传学习记录
      uploadRecord(){
        let data = {
          video: this.videoId,
          videoInfo:this.courese,
          startDate:this.startDate,//最近一次登录时间
          endDate:new Date().toLocaleString(),//最近一次离开时间
        };

        if(this.readRecord && this.readSecond < this.readRecord.watchTime){
          data.watchTime = this.readRecord.watchTime
        }else {
          data.watchTime = this.readSecond
        }

        if(this.readRecord && this.readRecord.readTimes){
          data.readTimes = this.readRecord.readTimes+1
        }else{
          data.readTimes=1
        }

        if(this.readRecord && this.readRecord._id){
          data._id = this.readRecord._id
        }
        // //是否增加一条阅读记录，还是只记录阅读时长和日期
        // if(addTimes){
        //   data.isAddTimes = true;
        // }
        if(this.readSecond){
          var loading = this.$message({
            showClose: true,
            duration:'30000',
            message: 'Uploading...'
          });
          uploadReadRecord(data).then(res => {
            console.log('uploadReadRecord',res)
            this.readSecond = 0;
            loading.close();
            this.$message({
              showClose: true,
              message: 'Upload record successful',
              type: 'success'
            });
            // this.init();
          })
        }

      },
      fetch(){
        var id = this.$route.query.id;
        this.videoId = id;
        var loading = this.$message({
          showClose: true,
          duration:'30000',
          type:'warning',
          message: 'Loading...'
        });
        watchCourese({videoId:id}).then(res=>{
          console.log('watchCourese',res)
          this.courese = res.data.data
          this.fetchmore();
          if(res.data.data)this.player.src('http://media.dfi.ac.cn/'+res.data.data.url);
          loading.close();
          // this.player.load()  //使video重新加载
        })
      },
      fetchmore(){
        let query={};
        query['type.className'] = this.courese.type.className;
        getCourese(query).then(res=>{
          this.CoureseArr = res.data.data
        })
      },
      //页面数据初始化
      init(){
        this.startDate = new Date().toLocaleString();//记录登录时间
        this.fetch();
        this.fetchRecord();
      },
      watch(id){
        console.log(id,this.videoId)
        if(id == this.videoId)return;
        this.$router.replace({path:'/courese/read',query:{id:id}});
        this.uploadRecord(); //上传学习记录
        this.init();
      },
      playerReady(){
        $("video").on('click ',function(){
          console.log('点击P标签');
        })
      },

      onTimeupdate(player){
      //  时间更新时处罚
        this.readSecond = player.currentTime() ;
      },

      // listen event
      onPlayerPlay(player) {
        // console.log('player play!', player)
        if(this.doubleClick){
          console.log('player play! 双击了！！！！！！！！');
          let currentTime =  this.player.currentTime();
          currentTime = currentTime > 6 ? currentTime-5 : 0; //倒退5秒
          this.player.currentTime(currentTime)
        }
      },
      onPlayerPause(player) {
        //加上一个500毫秒的监听双击状态，用于倒退
        this.doubleClick=true;
        let self = this;
        setTimeout(function () {
          self.doubleClick=false;
        },500);
        //每次暂停都记录目前观看的信息


        console.log('player pause!', player,player.currentTime())
      },
      // ...player event
      onPlayerEnded(){
        this.uploadRecord();
      },
      // or listen state event
      playerStateChanged(playerCurrentState) {
        console.log('player current update state', playerCurrentState)
      },

      // player is ready
      playerReadied(player) {
        console.log('the player is readied', player)
      }
    },
    mounted() {
      // console.log('this is current player instance object', this.player)
      this.$message({
        showClose: true,
        message: '播放时双击暂停键可回看哦',
        type: 'message',
        duration:'1000',
      });
      this.startDate = new Date().toLocaleString();//记录登录时间
      this.init();
      //给页面添加监听关闭或刷新
      window.addEventListener('beforeunload',this.beforeunloadFn)
    },
    beforeDestroy(){
      this.beforeunloadFn();
    },
    destroyed() {
      //卸载添加的方法
      window.removeEventListener('beforeunload', this.beforeunloadFn)
    },

    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    filters:{
      toMinutes:function(time) {
        time = Math.floor(time);//把传进来的秒数转成整数
        let min=0,sec=0;
        min = Math.ceil(time/60);
        sec = time%60;
        return (min ? min+'Mins': '');
      }
    },
  }

  // window.onbeforeunload=function(e){
  //   var e = window.event||e;
  //   console.log('------------从小加载')
  //   e.returnValue=("请认真观看完每个视频");
  // }

</script>
<style scoped>
  .input_video{
    width: 100%;
    margin: 0 auto;
    margin-top: 50px;
  }
  .container{margin: 10px 0;}
  .footer{position: fixed;left: 0;bottom: 0;width: 100%;}
  .content{margin-bottom: 100px;}
  .section{padding: 15px;margin-bottom: 10px;}
  .session-title{padding-left: 15px;padding-bottom: 10px;}
  .info{box-shadow: 0 2px 7px 0 #eee;margin-bottom: 10px; }
  .describe{font-size: 12px;color: #393939;margin-top: 5px;}
  .media{display: flex;justify-items: center;align-items: center;background: #efefef;padding: 15px;margin-bottom: 2px;}
  .media .introduce{font-size: 10px;color: #999;}
.poster-sm{width: 100px;}
  .fixed-bottom-center{position: fixed;bottom: 0;left: 50%;margin-left: -25%;}
  .hini{font-size: 12px;text-align: center;display: block;width: 100%;}
  .btn{width: 2em;height: 2em;background-position: center;background-repeat: no-repeat;display: inline-block;background-size: cover;}
  .btn.play{background-image: url("../../../assets/images/play.png");}
  .btn.pause{background-image: url("../../../assets/images/pause.png");}
  .recommend-warp{overflow: scroll;height: calc(100vh - 400px);}
  .flex-between{display: flex;justify-content: space-between;align-items: center;}

  .bg-warning{color: #fff;}
  .text-sm{font-size: 12px;}
  .class-part{border-bottom:1px solid rgba(0,0,0,.125); margin-bottom: 15px;padding-bottom: 15px;}
  .courese-warp{margin-left: 30px;margin-top: 15px;}
  .poster-xsm{width: 1em;height: 1em;display: inline-block;vertical-align: text-bottom;}
  .courese{margin-bottom: 10px;}
.timer-warp{position: fixed;bottom: 42px;right: 0;}
  .hini-warp{padding: 5px 10px;font-size: small;width: 100%;background: #64af28;box-sizing: border-box;}
  .btn-upload{width:40px;height: 30px;background-repeat: no-repeat;background-position: center;
    background-image: url("../../../assets/images/upload.png");background-color: #46c382;border-radius: 15px;
    background-size: 24px; margin-left: 1em;display: inline-block;vertical-align: middle;}

</style>
