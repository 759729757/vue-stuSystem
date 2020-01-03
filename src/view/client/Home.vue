<template>
  <el-row class="tab-warp">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>

    <!--底部导航栏-->
    <div class="footer-nav" id="footer">
      <ul>
        <li v-for="(item,index) in $router.options.routes"
            v-if="item.iconCls"
            @click="$router.push(item.path.replace('*',''))"
             :class="$route.path.indexOf(item.iconCls)!= -1 ?'active '+item.iconCls:item.iconCls "  >
          <a>{{item.name}}</a>
        </li>
        <!--<li  class="lecture">-->
          <!--<a>讲座</a>-->
        <!--</li>-->
        <!--<li  class="mine">-->
          <!--<a>我的</a>-->
        <!--</li>-->
      </ul>
    </div>
  </el-row>
</template>

<script>
  export default {
    data(){
      return {

      }
    }
  }
</script>

<style scoped>


  .tab-warp{height: 100%;overflow-y: scroll;
    display: flex;
    width: 100%;    justify-content: center;
    flex-direction: row;}
  img{max-width: 100%;}
  .footer-nav{height: 50px;position: fixed;bottom: -1px;left: 0;width: 100%;border-top:solid 1px #c9c9c9;background-color: white;}
  *{margin: 0;padding: 0;list-style: none;border: 0;z-index: 99;}
  section{width: 100%;}
  .footer-nav ul{display: flex;justify-content: space-between;justify-items: center;}
  .footer-nav ul li{flex-grow:1;padding-top: 22px;box-sizing: border-box;color: #ccc;}
  .footer-nav ul li a{width: 100%;display: block;text-align: center;padding: 10px 0;line-height: 1em;font-size: 12px;color: #ccc;}
  .footer-nav ul li{background-position: center 20%;background-repeat: no-repeat;background-size:  1.5em;}
  .footer-nav ul li.equipment{background-image: url("../../assets/images/_equipment.png");}
  .footer-nav ul li.tools{background-image: url("../../assets/images/_tools.png");background-size: 1.8em;}
  .footer-nav ul li.mine{background-image: url("../../assets/images/_mine.png");}
  .footer-nav ul li.active a{color: #0bb20c;}
  .footer-nav ul li.equipment.active{background-image: url("../../assets/images/equipment.png");}
  .footer-nav ul li.tools.active{background-image: url("../../assets/images/tools.png");}
  .footer-nav ul li.mine.active{background-image: url("../../assets/images/mine.png");}
</style>
