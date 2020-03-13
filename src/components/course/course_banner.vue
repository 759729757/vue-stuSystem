<template>
  <div>
    <div class="banner">
      <div class="menu" @click="showMenu"></div>
      <div class="logo">
      </div>
      <div v-show="user" class="userInfo">
        {{user && user.name}}
        <img class="headImg" :src="user && user.avatarUrl" >
      </div>
    </div>
    <div class="menu-content" v-if="menuShow">
      <div class="cover" @click="menuShow=false"></div>
      <div class="menu-list-warp">
        <div class="menu-list">
          <div class="menu-link" @click="goProfile"><i class="icon icon-profile"></i> Personal Profile</div>
          <div class="menu-link" @click="goRecord"><i class="icon icon-record"></i> View Record</div>
          <div class="menu-link" @click="goList"><i class="icon icon-list"></i> Course List</div>
          <div class="menu-link" @click="goFreeback"><i class="icon icon-feedback"></i> Feedback</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUserDetail } from '../../api/api';

  export default {
    name: 'course_banner',
    data(){
      return{
        user:{},menuShow:false,
      }
    },
    methods:{
      goProfile:function(){
        this.$router.push({path:'/mine/'})
      },
      goRecord:function(){
        this.$router.push({path:'/courese/record'})
      },
      goList:function(){
        this.$router.push({path:'/courese/'})
      },
      goFreeback:function(){
        this.$router.push({path:'/courese/suggest'})
      },

      showMenu:function(){
        this.menuShow = true;
      },
      getUser:function () {
        getUserDetail().then(res=>{
          console.log(res)
          this.user = res.data.user
        })
      }
    },
    mounted () {
      this.getUser();
    }
  }
</script>

<style scoped>

  .banner{display: flex;justify-content: space-between;padding: 5px 0;box-shadow: #999 0 0 4px 0;
    position: fixed;width: 100%;height: 40px;background: white;top: 0;left: 0;z-index: 2;}
  .input_video{
    width: 100%;
    margin: 0 auto;
  }
  .logo{width: 40px;height: 30px; background-image: url("../../assets/images/logo.png");background-position: center;background-repeat: no-repeat;
    background-size: 40px;margin: 5px 0;}
  .menu{background-image: url("../../assets/images/list.png");background-position:10% center ;background-repeat: no-repeat;
    background-size: 25px;width: 40px;height: 40px;}
  .banner>div{width: 33.333%;}
  .userInfo{color: #999;font-size: small;text-align: right;padding-right: 10px;box-sizing: border-box;}
  .headImg{width: 30px;height: 30px;border-radius: 30px;display: inline-block;vertical-align: middle;margin: 5px 0;}

  .menu-content{position: fixed;width: 100%;height: 100%;left: 0;top: 50px;transition: all .35s;z-index: 3;}
  .menu-content .cover{width: 100%;height: 100%;background: rgba(0,0,0,.25);left: 0;top: 0;transition: all .3s;
  animation: showCover .3s ease 0s 1 normal;}
  @keyframes showCover {
    0%{opacity: 0;}100%{opacity: 1;}
  }
  .menu-list-warp{width: 65%;height: 100%;background:#f2f2f2;left: 0;top: 0;position: absolute;z-index: 2;
    padding-left: 20px;padding-top: 20px;box-sizing: border-box;
    animation: showMenu .3s ease-out 0s 1 normal;}
  @keyframes showMenu {
    0%{opacity: 0;left: -100%;}100%{opacity: 1;left: 0;}
  }
  .menu-list{background: white;width: 100%;height: 100%;}
  .menu-link{padding: 10px 0;border-bottom: 1px #ccc solid;transition: all .35s;}
  .menu-link:hover{background-color: #64af28;color: white;}
  .menu-list .icon{display: inline-block;width: 25px;height: 25px;vertical-align: middle;margin-left: 15px;margin-right: 5px;
    background-position: center;background-size: 18px;background-repeat: no-repeat;}
  .icon-profile{background-image: url("../../assets/images/Profile.png");}
  .icon-record{background-image: url("../../assets/images/record.png");}
  .icon-list{background-image: url("../../assets/images/course.png");}
  .icon-feedback{background-image: url("../../assets/images/question.png");}
</style>
