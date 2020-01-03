<template>
    <section >
      <div class="page">
        <div class="page__hd" style="color: #363636;">
          <h1 class="page__title">申请记录</h1>
          <p class="weui-footer__text">最近五条</p>
          <p class="weui-footer__text" v-if="warnHini" style="color: brown;">你有不良记录！请按时归还设备，否则影响设备借用</p>

        </div>
        <div class="page__bd">

          <div class="weui-form-preview" v-for="item in record">
            <div class="weui-form-preview__hd">
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">状态</label>
                <em class="weui-form-preview__value" :class="'status'+item.status">{{item.status|statusFormat}}</em>
              </div>
            </div>
            <div class="weui-form-preview__bd">
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">申请设备</label>
                <span class="weui-form-preview__value">{{item.equipName}}</span>
              </div>
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">申请时间</label>
                <span class="weui-form-preview__value">	{{item.applyTime}}</span>
              </div>
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">借用日期</label>
                <span class="weui-form-preview__value">	{{item.startTime}}至{{item.endTime}} </span>
              </div>
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">借用事由</label>
                <span class="weui-form-preview__value">{{ item.cause }},{{ item.causeDetail }} </span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
</template>

<script>
  import { applyList } from '../api/api';
  export default {
    name: 'equRecordList',
    data(){
      return{
        record:[],warnHini:0,
      }
    },
    filters:{
      statusFormat: (val)=> {
        let status = ['待审批', '通过', '不通过','已领取','已归还','逾期归还'];
        return status[val]
      }
    },
    methods:{

    },
    mounted () {
      applyList().then(res=>{
        console.log('applyList',res)
        let record = res.data.data;
        record.forEach(item =>{
          if(item.status > 4){
          //  有逾期记录
            this.warnHini ++ ;
          }
        })
        this.record = record;
      })
    },
    watch:{

    }

  }

</script>

<style scoped>
  .page__hd{padding: 10px 15px;box-sizing: border-box;}
  .status0{color: dodgerblue;}
  .status1{color: blueviolet;}
  .status2{color: brown;}
  .status3{color: darkgoldenrod;}
  .status4{color: #0bb20c;}
  .status5{color: brown;}
</style>
