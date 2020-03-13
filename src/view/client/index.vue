<template>

</template>

<script>
  var  getUrlStr = function(name){
    /**
     * 获取地址栏参数
     */
    let reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)","i");
    if(reg.test(window.location.href)){
      return unescape(RegExp.$2.replace(/\+/g," "))
    }
    return undefined
  }
  export default {
    name: 'index',
    mounted () {
      console.log('index window.location.href:',window.location.href);
      let toRouter = getUrlStr('state');
      if( toRouter && toRouter.indexOf('routeTo')>-1 ){
        //登录到客户端
        var _router = toRouter.substring(toRouter.indexOf('routeTo')+7,toRouter.length)
        console.log('_router',_router)
        // if( !sessionStorage.getItem('isJump') ){
        //   sessionStorage.setItem('isJump',true);
        this.$router.push({ path: '/'+_router })
        // }else{
        //   this.$router.push({ path: '/mine/' });
        // }
      }else{
        this.$router.push({ path: '/mine/' });
      }
    }
  }
</script>

<style scoped>

</style>
