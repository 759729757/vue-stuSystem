<template>
  <section v-infinite-scroll="load" infinite-scroll-immediate="false">

    <div class="banner">
      <img :src="'http://stusystem.dfi.ac.cn/stuInfoSystem/images/news/'+active.banner" alt="">
    </div>
    <div class="content" >
      <div class="title-warp">
        <span class="title">
          {{ active.title }}
        </span>
        <div>
          <small>图片 {{ allImgs.length+imgs.length }}</small> &nbsp;&nbsp;
          <small>阅读 {{ active.read }}</small>
        </div>
        <div v-if="countDownTime">
          <el-link type="warning">活动将于{{countDownTime}}后开始</el-link>
        </div>
      </div>

      <div class="album" >
        <img class="photo" v-for="(item,index) in imgs" :highurl="item.highurl" :src="item.url" data-author="摄影师" :key="index"
             :preview="item.preview" :preview-text="item.title">
      </div>
    </div>

    <div class="tools" v-if="allImgs.length || imgs.length">
      <div class="btn btn-totop" @click="toTop"></div>
      <div class="btn btn-refresh" @click="fetch"></div>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="loading">
        <div class="weui-mask_transparent"></div>
        <div class="weui-toast">
          <i class="weui-loading weui-icon_toast"></i>
          <p class="weui-toast__content">数据加载中</p>
        </div>
      </div>
    </transition>

  </section>
</template>
<script>
  import Vue from 'vue'
  import preview from 'vue-photo-preview'
  import 'vue-photo-preview/dist/skin.css'
  import { fetchPhoto } from '../../../api/api';
  var options={
    fullscreenEl:false //关闭全屏按钮
  }
  Vue.use(preview,options)
  export default {
    name: 'site',
    data () {
      return {
        loading: false,
        active:{},
        page:0,//第几页,每页显示 16 张~
        allImgs : [],//放全部图片数据
        imgs: [ ] ,//用来显示的数据
        countDownTime:'',
      }
    },
    methods:{
      //触底加载图片
      load:function(){
        var page = this.page++ ,
          _arr = this.allImgs.splice(0,16);
        // console.log('触底',page,'arr',_arr);

        if(!_arr.length)    {
          this.$notify({
            title: '提示',
            message: '没有更多内容啦~',
            position: 'bottom-left',
            duration:'1500'
          });
          return false;
        }

        this.imgs = this.imgs.concat( _arr );
        this.$previewRefresh();//更新图片数据后，重新渲染图片查看器

        this.loading = true;//模拟获取数据的动画效果
        setTimeout( () => {
          this.loading = false;
        },500)

      },
      fetch:function(){
        var data={};
        this.imgs=[];
        this.allImgs=[];
        data._ = new Date().valueOf();

        fetchPhoto(data).then(res=>{
          let { photo , active } = res.data.data;
          this.active = active;
          (active.title) && (document.title = active.title);

          //如果还没到活动时间,显示提示
          if( new Date().valueOf() < new Date(active.date).valueOf() ){
            let time = new Date(active.date).toLocaleString();

            let timers = setInterval(()=> {
              this.countDownTime = countDown(active.date);
              if( new Date().valueOf() > new Date(active.date).valueOf() ){
                this.fetch();
                clearInterval(timers);
              }
            },1000)

            // this.$notify({
            //   title:'提示',
            //   message:`活动将于 ${this.countDownTime} 之后开始`,
            //   duration:0,
            //   position: 'bottom-left',
            //   showClose:false,
            //   offset:200
            // })
            return
          }

          let imgUrl = 'http://stusystem.dfi.ac.cn/stuInfoSystem/images/';
          photo = photo.map( item => {
            let img={};
            img.url = imgUrl + 'livePhoto_compress/' + item;
            img.highurl = imgUrl + 'livePhoto/' + item.replace(/^_/,'deal-');
            img.preview = 1;
            return img;
          } )
          this.allImgs = photo;
          this.load();

        })

      },
      toTop:function(){
        console.log($('.album').scrollTop());
        $('#app').animate({scrollTop:0},300);
      }
    },
    mounted () {
      this.fetch();
      // this.$previewRefresh();//更新数据后自动更新图片
    }
  }

  //倒计时
  function countDown (date) {
    let timestamp = new Date(date).valueOf() - new Date().valueOf();//毫秒级
    const unit_day = 1000 * 60 * 60 * 24 , unit_hour = 1000 * 60 * 60,unit_minute = 1000 * 60,unit_section = 1000;
    let days,hours,minutes,sections;
    if(timestamp >= unit_day){
      days = Math.floor( timestamp / unit_day );//包含天数
        timestamp = timestamp % unit_day;//剩余的毫秒
    }
    if(timestamp >= unit_hour){
      hours = Math.floor( timestamp / unit_hour );//包含的小时数
      timestamp = timestamp % unit_hour;//剩余的毫秒
    }
    if(timestamp >= unit_minute){
      minutes = Math.floor( timestamp / unit_minute );//包含的分钟数
      timestamp = timestamp % unit_minute;//剩余的毫秒
    }
    sections = Math.floor( timestamp / unit_section );//把毫秒转成秒

    // console.log(`${days}天${hours}小时${minutes}分钟${sections}秒`)
    return (days ? days + '天' : '')+
      (hours ? hours + '小时' : '')+
      (minutes ? minutes + '分' : '')+ (sections+'秒')
  }
</script>

<style scoped >
  section{background: white;}
  .content{width: 96%;margin:0 2%;}
  .banner{width: 100%;}
  .banner img{width: 100%;}
  .title-warp{margin: 10px 0;}
  .title{font-size: 22px;}
   small{color: #696969;}
  .album{display: flex;flex-direction: row;justify-content: flex-start;align-items: center;flex-wrap: wrap;height: calc(100% - 60px);
    overflow: scroll;}
  .photo{width:49%;display: inline-block;margin-bottom: 2%;box-sizing: border-box;}
  .photo:nth-child(2n + 1){margin-right: 2%;}
  .tools{position: fixed;right: 10px;bottom: 20px;top: auto;width: 50px;height: 100px;
  display: flex;flex-direction: column;justify-content: center;align-items: center;}
  .btn{width: 2em;height: 2em;border-radius: 2em;background-position: center;background-repeat: no-repeat;margin: 10px 0;
    background-color: rgba(0,0,0,.5);background-size: 1em;border: rgba(100,100,100,.5) solid 1px;display: inline-table;}
  .btn-totop{background-image: url("../../../assets/images/toTop.png");}
  .btn-refresh{background-image: url("../../../assets/images/refresh.png");}

  .weui-mask_transparent{background: rgba(0,0,0,.32);}
  .weui-toast{top: 50%;left: 50%; margin-left: -3.8em; margin-top: -3.8em;}

</style>
