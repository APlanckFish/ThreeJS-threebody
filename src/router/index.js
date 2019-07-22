import Vue from 'vue'
import Router from 'vue-router'
import threeBody from '@/components/three-body'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'threeBody',
      component: threeBody
    }
  ]
})
