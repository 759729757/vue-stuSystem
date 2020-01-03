//普通客户端
import routes from './client'
import routers_admin from './admin'

import VueRouter from 'vue-router'

export default new VueRouter({
  routes:[...routers_admin,...routes]
})



