<template>
    <section ref="form">
      <!--场地借用-->
      <div id="site" class="siteType" >
        <div class="weui-cell" style="padding: 0;"></div>
        <div class="weui-cell weui-cells_radio flextop">
          <div class="weui-cell__hd"><label class="weui-label">场地选择</label></div>
          <div class="weui-cell__hd">
            <label class="weui-cell weui-check__label " for="x12">
              <div class="weui-cell__bd">
                <p>耦合空间</p>
              </div>
              <div class="weui-cell__ft">
                <input type="radio" class="weui-check" value="耦合空间" v-model="form.equipName" name="equipName" id="x12">
                <span class="weui-icon-checked"></span>
              </div>
            </label>
            <label class="weui-cell weui-check__label " for="x13">

              <div class="weui-cell__bd">
                <p>D3303工作室</p>
              </div>
              <div class="weui-cell__ft">
                <input type="radio" name="equipName" value="D3303工作室" v-model="form.equipName" class="weui-check" id="x13" checked="checked">
                <span class="weui-icon-checked"></span>
              </div>
            </label>
            <label class="weui-cell weui-check__label " for="x14">
              <div class="weui-cell__bd">
                <p>D3303摄影棚</p>
              </div>
              <div class="weui-cell__ft">
                <input type="radio" class="weui-check" value="D3303摄影棚" v-model="form.equipName" name="equipName" id="x14">
                <span class="weui-icon-checked"></span>
              </div>
            </label>
          </div>
        </div>

        <div class="weui-cell weui-cells_radio flextop">
          <div class="weui-cell__hd"><label class="weui-label">借用事由</label></div>
          <div class="weui-cell__hd">
            <label class="weui-cell weui-check__label " for="x16" @click="exhibition=true">
              <div class="weui-cell__bd">
                <p>展览</p>
              </div>
              <div class="weui-cell__ft">
                <input type="radio" class="weui-check" value="展览" v-model="form.cause" name="cause" id="x16" checked="checked">
                <span class="weui-icon-checked"></span>
              </div>
            </label>
            <label class="weui-cell weui-check__label " for="x15" @click="exhibition=false">
              <div class="weui-cell__bd" style="width: 2em;display: inline-table;">
                <p for="x15">活动</p>
              </div>
              <div class="weui-cell__ft">
                <input type="radio" name="cause" value="其他" v-model="form.cause" class="weui-check" id="x15">
                <span class="weui-icon-checked"></span>
              </div>
              <div>
                <input type="text" name="cause" id="_causeDetail" v-model="form.cause" placeholder="请输入借用事由" style="display: none;">
              </div>
            </label>
          </div>
        </div>

        <div class="site-display" v-show="exhibition">
          <div class="weui-cell" style="padding: 0;"></div>
          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">活动名称</label></div>
            <div class="weui-cell__bd">
              <input class="weui-input need" type="text" v-model="form.causeDetail" name="causeDetail" placeholder="请输入 活动/展览 名称"/>
            </div>
          </div>
          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">展览日期</label></div>
            <div class="weui-cell__bd">
              <div id="checkinout">
                <div id="firstSelect" style="width:100%;">
                  <div class="Date_lr" style="float:left;">
                    <P>开始</p>
                    <input id="startDate" name="startTime" v-model="form.startTime" type="text" value="" style="" readonly>
                  </div>
                  <div class="Date_lr" style="float:right;">
                    <p>结束</p>
                    <input id="endDate" name="endTime" v-model="form.endTime" type="text" value="" style="" readonly>
                  </div>
                  <span class="span21">共<span class="NumDate" id="NumDate">1</span>天</span>
                </div>
              </div>
              <div class="mask_calendar" id="mask_calendar">
                <div class="calendar" id="calendar"></div>
                <!-- 提示 -->
                <div class="calendar_tishi">请选择结束时间...</div>
              </div>
            </div>
          </div>
        </div>

        <div class="site-others" v-show="!exhibition">
          <div class="weui-cell" style="padding: 0;"></div>
          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">活动名称</label></div>
            <div class="weui-cell__bd">
              <input class="weui-input need" type="text" v-model="form.causeDetail" name="causeDetail" placeholder="请输入活动名称"/>
            </div>
          </div>
          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">开始时间</label></div>
            <div class="weui-cell__bd" style="display: flex;">
              <input class="weui-input need" id="sDate" v-model="startTimeDate" name="startTime" type="date" value=""/>
              <input class="weui-input  text-center" v-model="startTimeTime"  name="startTime" type="time" />
            </div>
          </div>
          <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">结束时间</label></div>
            <div class="weui-cell__bd" style="display: flex;">
              <input class="weui-input need" id="eDate" v-model="endTimeDate" name="endTime" type="date" value=""/>
              <input class="weui-input  text-center" v-model="endTimeTime"  name="endTime" type="time" />
            </div>
          </div>
        </div>

      </div>



    </section>
</template>

<script>
  import $ from 'jquery';
  require('../assets/js/date.js');
  export default {
    name: 'sitePart',
    props:['form'],
    data(){
      return{
        exhibition:true,//借用事由：默认展览，或者其他活动
        startTimeDate:this.getFormatDate(),startTimeTime:'18:00',
        endTimeDate:this.getFormatDate(),endTimeTime:'20:00',

      }
    },
    methods:{
      getFormatDate:function (days) {
        var b=new Date();
        if(days) b = new Date(b.getTime()+24*36*1000*days);
        var ye=b.getFullYear();
        var mo=b.getMonth()+1;
        mo = mo<10?"0"+mo:mo;
        var da=b.getDate();
        da = da<10?"0"+da:da;
        return (ye+'-'+mo+'-'+da);
      }
    },
    mounted () {
      var height = this.$refs.form.clientHeight+20;
      this.$emit('setHeight',height+'px');

      $('#firstSelect').on('click',function (e) {
        console.log('false')
        e.stopPropagation();
        e.preventDefault();
        $('#mask_calendar').show();
      });
      $('#mask_calendar').on('click',function (e) {
        e.stopPropagation();
        e.preventDefault();
        if(e.target.className == "mask_calendar"){
          $('#calendar').slideUp(200);
          $('#mask_calendar').fadeOut(200);
        }
      });


      initCanlender(this);
    },
    watch:{
      startTimeDate(){
        let DateTime = this.startTimeDate+' '+this.startTimeTime;
        this.$emit('set-form-item',['startTime',DateTime]);
      },
      startTimeTime(){
        let DateTime = this.startTimeDate+' '+this.startTimeTime;
        this.$emit('set-form-item',['startTime',DateTime]);
      },
      endTimeDate(){
        let DateTime = this.endTimeDate+' '+this.endTimeTime;
        this.$emit('set-form-item',['endTime',DateTime]);
      },
      endTimeTime(){
        let DateTime = this.endTimeDate+' '+this.endTimeTime;
        this.$emit('set-form-item',['endTime',DateTime]);
      },

      // exhibition(){
      //   var height = this.$refs.form.clientHeight+20;
      //   this.$emit('setHeight',height+'px');
      // }
    }

  }

  function initCanlender (vue) {
    var self = vue;
    $('#firstSelect').calendarSwitch({
      selectors : {
        sections : "#calendar",
        //firstSelect
        firstSelect:"#firstSelect",
        //mask_calendar
        mask_calendar:"#mask_calendar",
        //calendar1
        calendar:"#calendar",
        //startDate
        startDate:"#startDate",
        //endDate1
        endDate:"#endDate",
        //NumDate1
        NumDate:"#NumDate"
      },
      index : 4,      //展示的月份个数
      animateFunction : "slideToggle",        //动画效果
      controlDay:true,//知否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
      daysnumber : "90",     //控制天数
      comeColor : "#09BB07",       //入住颜色
      outColor : "#09BB07",      //离店颜色
      comeoutColor : "#E0F4F2",        //入住和离店之间的颜色
      callback :function(){//回调函数
        $('#mask_calendar').fadeOut(200);
        var startDate = $('#startDate').val();  //入住的天数
        var endDate = $('#endDate').val();      //离店的天数
        var NumDate = $('#NumDate').text();    //共多少晚
        self.form.startTime = startDate;
        self.form.endTime = endDate;
        console.log(startDate);
        console.log(endDate);
        console.log(NumDate);
        //下面做ajax请求
      },
      comfireBtn:'#comfire'//确定按钮的class或者id
    });
  }
</script>

<style scoped>
  #_causeDetail{width:100%;border-width: 0 0 1px 0;padding-left:2px;border-bottom: 1px #000 solid;height: 1.8em;font-size: 14px;}
  .weui-label{font-weight: 600;color: #393939;font-size: 17px;}
  .text-center{text-align: center;}
  .f_left{float: left;}
  .flextop{align-items: baseline;-webkit-align-items: baseline;}
  /*.siteType{display: none;}*/
  .updown10{margin: 10px 0;}
  .Date_lr{width:50%;text-align:center;}
  .span21{
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    font-size:14px;
    color: #666;
    /*border: 1px solid #e5e5e5;*/
    /*padding:2px 8px;*/
    line-height: 20px;
    border-radius: .2rem;
    background-color: #fff;
  }
  #checkinout,#checkinout1{
    height: 50px;
    line-height: 50px;
    position: relative;
    display: -webkit-box;
    display: flex;
  }
  #firstSelect p,#firstSelect1 p{line-height:25px;color: #999;font-size:12px;}
  #startDate,#startDate1{border:0;position: absolute;left: 0;margin: 0 auto;width: 50%;font-size: 16px;color: #09BB07;text-align: left;}
  #endDate, #endDate1{border:0;position: absolute;right: 0;margin:auto 0;width:50%;font-size: 16px;color: #09BB07;text-align: right;}
  .mask_calendar {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.4);
    display: none;
    z-index: 9999;
  }
  .calendar {
    height: 400px;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
  }
  @keyframes slideInDown {
    from {
      transform: translate3d(0, -100%, 0);
      visibility: visible;
    }

    to {
      transform: translate3d(0, 0, 0);
    }
  }
  .slideInDown {
    animation-name: slideInDown;
  }
  /*提示*/
  .mask_calendar {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.4);
    display: none;
    z-index: 9999;
  }
  .calendar {
    height: 400px;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .calendar_tishi {
    width: 150px;
    height: 30px;
    padding: 12px;
    background: rgba(0,0,0,.6);
    position: fixed;
    top: 0;
    bottom: 120px;
    left: 0;
    right: 0;
    margin: auto;
    color: #fff;
    font-size: 16px;
    text-align: center;
    border-radius: 4px;
    display:none;
  }
  @media (max-width: 320px) {
    .span21{top: 23%;font-size: 12px;}
  }
</style>
