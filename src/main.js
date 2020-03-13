// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './view/client/App'
import VueRouter from 'vue-router'
import router from './router'
import $ from 'jquery'
import 'font-awesome/css/font-awesome.min.css'
import 'element-ui/lib/theme-chalk/index.css'


import axios from 'axios';
import {loginByCode} from './api/api'
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Content-Type'] = 'application/json';

// import preview from 'vue-photo-preview'
// import 'vue-photo-preview/dist/skin.css'
// Vue.use(preview)

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)


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
let code = getUrlStr('code');

router.beforeEach((to, from, next) => {
  let webTitle = to.name;
  document.title = webTitle;
  if(to.path.indexOf('@admin') >= 0 ){
    //登录到管理页面
    let admin = sessionStorage.getItem('admin');
    if(!admin && to.path!='/@adminLogin'){
    //  没登录，调到登录页面
      next({ path: '/@adminLogin' })
    }else{
      console.log('目前处于管理页面',axios.defaults.headers)
      axios.defaults.headers.common['Authorization'] = admin;
      next();
    }
  }
  else{
    next();
  }
})

function init () {
  return new Promise((resolve,reject)=>{
      if (code){
        loginByCode({code:code})
          .then(data =>{
            console.log('登陆返回信息：',data)
            let { mess, status, token } = data.data;
            if (status !== 1) { //没有绑定微信的账号，做绑定处理
              window.location.href='http://stusystem.dfi.ac.cn/stuInfoSystem/isbind.html';
                resolve();
            }else {
              sessionStorage.setItem('user', token);
              axios.defaults.headers.common['Authorization'] = token;
              resolve();
            }
          })
      }
      else if( document.location.href.indexOf('/@admin') === -1 ){
          //不是登录到后台
          if(!sessionStorage.getItem('user')){
            //  没有code ，没有缓存 user 记录，非正常进入链接，需要登录
            console.log('未登录');
          }else{
            axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('user');
          }
        resolve();
      }else{
        resolve();
      }
  })
}
init().then(res=>{
  new Vue({
    el: '#app',
    router,
    components: { App },
    render: h => h(App),
    template: '<App/>'
  })
})


