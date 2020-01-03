<template>
  <div id="app">
    <transition name="fade" mode="out-in" >
      <router-view v-if="isRouterAlive"/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      isRouterAlive:true
    }
  },
  methods:{
    reload(){
      this.isRouterAlive = false;
      // this.$nextTick(function () {
      //   this.isRouterAlive = true;
      // })
    }
  }
}
</script>

<style>
#app {
  font-family: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #030303;
}
.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

*{
  margin:0;
  padding:0;
}
.calendar{
  display: none;
  position: fixed;
  width: 100%;
  /* z-index: 999999999;
    top: 0; */
  overflow: auto;
  height: 100%;
  background: #fff;
  font-family: Tahoma,"Lucida Grande",Verdana,"Microsoft YaHei",hei;
}
.firstSelect{
  width:100%;
  background:#fff;
  position:fixed;
  top:0;
  left:0;
  height:100%;
  overflow:scroll;
  display:none;
}
body td{
  text-align:center;
  height:40px;
}
.dateZone{
  width:100%;
  margin:auto;
  background:#ffffff;
  border-bottom:1px solid #ddd;
  border-top:1px solid #ddd;
  color:#666;
  margin-top: 50px;
  position: fixed;
  z-index:9999;
}
.dateZone td{
  background:#ffffff;
  height:45px;
  line-height: 45px;
}
.tbody {
  margin-top: 97px;
}
.tbody td{
  background:#fff;
  color: #555;
}
.dateZone td{
  width:14.2%;
  font-size: 14px;
}
.dateZone .colo{
  color:#fa967f;
}
.dateTable{
  width:99.4%;
  margin:auto;
  border-bottom:1px solid #ddd;
}
.tbody .ny1{
  width:100%;
  text-align:center;
  padding:5px 0;
  color: #555;
  background-color: #FAFAFA;
  border-bottom:1px solid #ddd;
  font-size: 15px;
  line-height: 28px;
}
.dateTable td{
  width:14.2%;
  font-size: 14px;
}
.dateTable .rz{
  font-size:14px;
}
.datTip{
  background:rgba(0,153,255,0.8);
  width:40%;
  position:fixed;
  bottom:2px;
  left:30%;
}
.datTip p{
  width:100%;
  margin:auto;
  text-align:center;
  color:#fff;
  padding:3px 0;
  font-size:14px;
}
.rz{
  position:relative;
  /* display: none; */
}
.hover{
  font-size:14px;
  display:inline-block;
  width:60%;
  background:#FF3;
  /* display: none; */
  color:red;
  text-align:center;
  border-radius:5px;
}
td{
  border-radius:2px;
}
/* section{
    margin:10px;
    padding:5px;
    } */
@media only screen and (min-width:400px){
  body td{
    text-align:center;
    height:47px;
  }
}
@media only screen and (max-width:320px){
  body{
    font-size:14px;
  }
  .dateTable .rz{
    font-size:12px;
  }
  .datTip p{
    font-size:12px;
  }
  .hover{
    font-size:12px;
  }
  body td{
    text-align:center;
    height:35px;
  }
}
a{color: #000000;}
img{max-width: 100%;}
.footer-nav{height: 50px;position: fixed;bottom: -1px;left: 0;width: 100%;border-top:solid 1px #c9c9c9;background-color: white;}
*{margin: 0;padding: 0;list-style: none;border: 0;}
.footer-nav ul{display: flex;justify-content: space-between;justify-items: center;}
.footer-nav ul li{flex-grow:1;padding-top: 22px;box-sizing: border-box;color: #ccc;}
.footer-nav ul li a{width: 100%;display: block;text-align: center;padding: 10px 0;line-height: 1em;font-size: 12px;color: #ccc;}
.footer-nav ul li{background-position: center 20%;background-repeat: no-repeat;background-size:  1.5em;}
.footer-nav ul li.equipment{background-image: url("../../assets/images/_equipment.png");}
.footer-nav ul li.lecture{background-image: url("../../assets/images/_lecture.png");background-size: 1.8em;}
.footer-nav ul li.mine{background-image: url("../../assets/images/_mine.png");}
.footer-nav ul li.active a{color: #0bb20c;}
.footer-nav ul li.equipment.active{background-image: url("../../assets/images/equipment.png");}
.footer-nav ul li.lecture.active{background-image: url("../../assets/images/lecture.png");}
.footer-nav ul li.mine.active{background-image: url("../../assets/images/mine.png");}
/*.container{width: 100%;padding: 20px;box-sizing: border-box;}*/
.cells{display: flex;align-items:center;margin: 20px 0;background-color: white;padding: 1em;}
.cells.cells-list{flex-wrap: wrap;}
.head-img{width: 6em;text-align: center;}
.cells-text{padding: 0 1em;}
.cells-icon{width: 2em;}
.cells-icon img{vertical-align: middle;}
.cells.cells-bd{margin: 0;}
.cells-text.normal{color: #333;}
.cells-text.small{font-size: smaller;color: #333;}
.cells-bd{border-top: 1px #ccc solid;}
.cells-bd:nth-child(2),.cells-bd:nth-child(1){border-top: none;}
a{color: #333;}
.cells-title{text-align: center;width: 100%;font-weight: bold;}
.container{margin: 20px 0;}
.cells-grid{width: 31.33%;height: 140px;margin: 1%;box-sizing: border-box;
  background-size: cover;background-position: top;}
.cells .cells{width: 100%;padding: 10px 0;margin: 0;}
.cells-left-btn{width: 0;float: left;}
.cells-left-btn .back-icon{
  width: 1.2em;
  height: 1.2em;
  background-image: url("../../assets/images/back-icon.png");
  display: block;
  background-size: cover;
  background-position: center;
  z-index: 99;position: relative;
}
.cells .ipt{height: 40px;line-height: 40px;padding-left: 10px;width: 100%;
  border: 1px #ccc solid;border-radius: 5px;outline: none;}
.cells .btn{
  width: 100%;border-radius: 5px;height: 40px;line-height: 40px;font-size: 16px;
  background-color: #0bb20c;color: white;outline: none;
}
.cells .btn:hover{
  background-color: #64af28;
}
.cells-list{flex-grow: 1;text-align: center;}

</style>
