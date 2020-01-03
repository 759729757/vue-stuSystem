<template>
    <section class="">
      <div class="page">
        <div class="weui-msg">
          <div class="weui-msg__icon-area"><i class="weui-icon-success weui-icon_msg"></i></div>
          <div class="weui-btn-area moveInaminate">
            <a class="weui-btn weui-btn_primary" type="button"  target="_blank" href="http://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA5NzMwMzc0Nw==#&wechat_redirect">
              提交完成</a>
          </div>
          <div class="weui-footer moveInaminate">
            <p class="weui-footer__text">待相关老师审批</p>
            <p class="weui-footer__text">审批结果将以 <span style="color: darkgoldenrod;">短信通知，请留意手机短信</span></p>
          </div>
        </div>


      </div>


    </section>
</template>

<script>
  export default {
    name: 'result',
    props:[],
    data(){
      return{

      }
    },
    methods:{

    },
    mounted () {

    },
    watch:{

    }

  }

</script>

<style scoped>
  .page{background: white;padding-bottom: 50px;}


</style>
